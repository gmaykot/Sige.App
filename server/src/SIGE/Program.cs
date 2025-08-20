using System.Diagnostics;
using Microsoft.AspNetCore.HttpOverrides; // << add
using Serilog;
using Serilog.Context;
using Serilog.Events;
using SIGE.Configuration;

var builder = WebApplication.CreateBuilder(args);

// Configurar serviços
ConfigureServices(builder);

var seqUrl = Environment.GetEnvironmentVariable("SEQ_URL")
             ?? "http://62.72.8.4:5341/";

Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Override("Microsoft.AspNetCore", LogEventLevel.Warning)
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .WriteTo.Seq(seqUrl)
    .CreateLogger();

builder.Host.UseSerilog();

var app = builder.Build();

// 1) Logs de request (ok manter aqui)
app.UseSerilogRequestLogging(opts => {
    opts.GetLevel = (ctx, elapsed, ex) => ex != null ? LogEventLevel.Error : LogEventLevel.Information;
    opts.EnrichDiagnosticContext = (diag, http) => {
        diag.Set("TraceId", Activity.Current?.Id ?? http.TraceIdentifier);
        diag.Set("Path", http.Request.Path);
        diag.Set("Method", http.Request.Method);
        diag.Set("UserAgent", http.Request.Headers.UserAgent.ToString());
        diag.Set("ClientIP", http.Connection.RemoteIpAddress?.ToString());

        var userId =
            http.User?.FindFirst("usuario_id")?.Value ??
            http.User?.FindFirst("sub")?.Value ??
            (http.Items.TryGetValue("UsuarioId", out var v) ? v?.ToString() : null);

        if (!string.IsNullOrEmpty(userId))
            diag.Set("UsuarioId", userId);

        diag.Set("StatusCode", http.Response.StatusCode);

        if (http.Items.TryGetValue("PayloadStatus", out var s))
            diag.Set("PayloadStatus", s);
    };
});

// 2) Proxy awareness (Traefik/Coolify)
app.UseForwardedHeaders(new ForwardedHeadersOptions {
    ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
    // Traefik geralmente fica fora das redes "conhecidas" por padrão:
    // Se necessário, libere as restrições:
    ,
    RequireHeaderSymmetry = false
});
app.Services.GetRequiredService<Microsoft.Extensions.Options.IOptions<ForwardedHeadersOptions>>()
    .Value.KnownNetworks.Clear();
app.Services.GetRequiredService<Microsoft.Extensions.Options.IOptions<ForwardedHeadersOptions>>()
    .Value.KnownProxies.Clear();

// 3) Middlewares na ordem recomendada
app.UseMyExceptionHandler(app.Environment);
app.UseMyMiddlewares(app.Environment);
app.UseMyCors();

// ⚠️ Em container não habilite HSTS/HTTPS nativos do Kestrel.
// UseHttpsRedirection pode ficar, porque com ForwardedHeaders o Scheme será "https" atrás do Traefik
// e não haverá loop. Se preferir, condicione:
if (!app.Environment.IsDevelopment()) {
    // app.UseHsts(); // desabilitado dentro do container
    app.UseHttpsRedirection();
}

app.UseRouting();
app.UseMyRequestLocalization();

// Coloque compressão ANTES dos endpoints para pegar as respostas
app.UseResponseCompression();

app.UseMySwagger(app.Configuration);
app.UseMyEndpoints();

// 4) Escopo de log com UsuarioId
app.Use(async (ctx, next) => {
    var userId =
        ctx.User?.FindFirst("usuario_id")?.Value ??
        ctx.User?.FindFirst("sub")?.Value ??
        (ctx.Items.TryGetValue("UsuarioId", out var v) && v is string strValue ? strValue : null);

    using (LogContext.PushProperty("UsuarioId", userId ?? "anonimo")) {
        await next();
    }

    var usuario =
       ctx.User?.FindFirst("usuario_login")?.Value ??
       (ctx.Items.TryGetValue("UsuarioLogin", out var vu) && vu is string strValueUser ? strValueUser : null);

    using (LogContext.PushProperty("UsuarioLogin", usuario ?? "anonimo")) {
        await next();
    }
});

// 5) Não adicione URLs manualmente em produção (evita conflito com --urls do Dockerfile)
ConfigureEnvironmentSpecific(app);

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

void ConfigureMiddlewares(WebApplication app) { /* ← deixei vazio, a ordem ficou toda acima */ }

void ConfigureEnvironmentSpecific(WebApplication app) {
    // Só use URLs do appsettings em Dev, para não interferir no container
    if (app.Environment.IsDevelopment()) {
        var urls = app.Configuration.GetSection("Urls").Get<Dictionary<string, string>>();
        if (urls != null && urls.TryGetValue(app.Environment.EnvironmentName, out var environmentUrl)) {
            Log.Information("Configurando URL (Dev): {Url}", environmentUrl);
            app.Urls.Add(environmentUrl);
        }
    }

    if (app.Environment.IsProduction())
        Log.Information("Aplicação rodando em produção por trás de proxy (Traefik).");
    else
        Log.Information("Aplicação rodando em homologação.");
}
