using System.Diagnostics;
using System.Net;
using System.Security.Claims;
using Microsoft.AspNetCore.HttpOverrides;
using Serilog;
using Serilog.Context;
using Serilog.Events;
using SIGE.Configuration;
using AspNetIPNetwork = Microsoft.AspNetCore.HttpOverrides.IPNetwork;

var builder = WebApplication.CreateBuilder(args);

var seqUrl = Environment.GetEnvironmentVariable("SEQ_URL");
var appEnv = Environment.GetEnvironmentVariable("APP_ENV") ?? "DEV";

Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Override("Microsoft.AspNetCore", LogEventLevel.Warning)
    .MinimumLevel.Override(
        "Microsoft.EntityFrameworkCore",
        appEnv.Equals("PRD", StringComparison.OrdinalIgnoreCase)
            ? LogEventLevel.Error
            : LogEventLevel.Warning)
    .Enrich.WithProperty("Environment", appEnv)
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .WriteTo.Seq(seqUrl)
    .CreateLogger();

builder.Host.UseSerilog();

ConfigureServices(builder);

var app = builder.Build();

var fwd = new ForwardedHeadersOptions {
    ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto,
    ForwardLimit = 1,
    RequireHeaderSymmetry = false
};

fwd.KnownNetworks.Add(new AspNetIPNetwork(IPAddress.Parse("10.0.1.0"), 24));
fwd.KnownNetworks.Add(new AspNetIPNetwork(IPAddress.Parse("fd8a:97fb:1029::"), 64));
app.UseForwardedHeaders(fwd);

app.UseRouting();

app.UseSerilogRequestLogging(opts => {
    opts.GetLevel = (httpContext, elapsed, ex) =>
        ex != null
            ? LogEventLevel.Error
            : httpContext.Request.Method.Equals(HttpMethods.Options, StringComparison.OrdinalIgnoreCase)
                ? LogEventLevel.Debug
                : LogEventLevel.Information;

    opts.EnrichDiagnosticContext = (diag, http) => {
        diag.Set("TraceId", Activity.Current?.Id ?? http.TraceIdentifier);
        diag.Set("Path", http.Request.Path.ToString());
        diag.Set("Method", http.Request.Method);
        diag.Set("UserAgent", http.Request.Headers.UserAgent.ToString());

        diag.Set("ClientIP", http.Connection.RemoteIpAddress?.ToString());

        string? usuario =
            http.User?.FindFirst("usuario_login")?.Value
            ?? http.User?.Identity?.Name
            ?? http.User?.FindFirst("preferred_username")?.Value
            ?? http.User?.FindFirst("email")?.Value
            ?? (http.Items.TryGetValue("UsuarioLogin", out var u) ? u?.ToString() : null);

        if (!string.IsNullOrWhiteSpace(usuario))
            diag.Set("Usuario", usuario);

        string? usuarioId =
            http.User?.FindFirst("usuario_id")?.Value
            ?? http.User?.FindFirst("sub")?.Value
            ?? http.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value
            ?? (http.Items.TryGetValue("UsuarioId", out var v) ? v?.ToString() : null);

        if (!string.IsNullOrWhiteSpace(usuarioId))
            diag.Set("UsuarioId", usuarioId);

        diag.Set("StatusCode", http.Response.StatusCode);
        if (http.Items.TryGetValue("PayloadStatus", out var s))
            diag.Set("PayloadStatus", s);

        var endpoint = http.GetEndpoint();
        var routePattern = endpoint is Microsoft.AspNetCore.Routing.RouteEndpoint re
            ? re.RoutePattern?.RawText
            : endpoint?.DisplayName;
        if (!string.IsNullOrWhiteSpace(routePattern))
            diag.Set("Route", routePattern);
    };
});

app.UseMyExceptionHandler(app.Environment);
app.UseMyMiddlewares(app.Environment);
app.UseMyCors();

if (!app.Environment.IsDevelopment()) {
    app.UseHttpsRedirection();
}

app.UseMyRequestLocalization();

app.UseResponseCompression();

app.Use(async (ctx, next) => {
    var userId =
        ctx.User?.FindFirst("usuario_id")?.Value
        ?? ctx.User?.FindFirst("sub")?.Value
        ?? (ctx.Items.TryGetValue("UsuarioId", out var v) ? v?.ToString() : null);

    var userLogin =
        ctx.User?.FindFirst("usuario_login")?.Value
        ?? ctx.User?.Identity?.Name
        ?? (ctx.Items.TryGetValue("UsuarioLogin", out var vu) ? vu?.ToString() : null);

    using (LogContext.PushProperty("UsuarioId", userId ?? "anonimo"))
    using (LogContext.PushProperty("UsuarioLogin", userLogin ?? "anonimo")) {
        await next();
    }
});

app.UseMySwagger(app.Configuration);
app.UseMyEndpoints();

ConfigureEnvironmentSpecific(app, appEnv);

app.Run();

void ConfigureServices(WebApplicationBuilder builder) {
    builder.Services.AddMemoryCache();
    builder.Services.AddMyCors();
    builder.Services.AddMyRequestLocalizationOptions();
    builder.Services.AddMyControllers();
    builder.Services.AddMySwaggerGen(builder.Configuration);
    builder.Services.AddMyDependencies(builder.Configuration);
    builder.Services.AddMyDbContext(builder.Configuration);
    builder.Services.AddMyOptions(builder.Configuration);
    builder.Services.AddMyHostedService();
    builder.Services.AddMyCompression();
}

void ConfigureEnvironmentSpecific(WebApplication app, string appEnv) {
    switch (appEnv?.ToUpperInvariant()) {
        case "DEV":
            var urls = app.Configuration.GetSection("Urls").Get<Dictionary<string, string>>();
            if (urls != null && urls.TryGetValue(app.Environment.EnvironmentName, out var environmentUrl)) {
                Log.Information("🚀 Aplicação rodando em DESENVOLVIMENTO: {Url}", environmentUrl);
                app.Urls.Add(environmentUrl);
            }
            break;
        case "PRD":
            Log.Information("🚀 Aplicação rodando em PRODUÇÃO: https://app.coenel-de.com.br");
            break;
        case "HMG":
            Log.Information("🚀 Aplicação rodando em HOMOLOGAÇÃO: https://hmg.faturesimples.space");
            break;
        default:
            Log.Information("🚀 Aplicação rodando em AMBIENTE DESCONHECIDO");
            break;
    }
}
