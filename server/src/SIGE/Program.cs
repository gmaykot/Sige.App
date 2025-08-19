using System.Diagnostics;
using Serilog;
using Serilog.Context;
using Serilog.Events;
using SIGE.Configuration;

var builder = WebApplication.CreateBuilder(args);

// Configurar serviços
ConfigureServices(builder);

var seqUrl = Environment.GetEnvironmentVariable("SEQ_URL")
             ?? "http://72.60.11.13:5341/"; // ajuste pro seu host

Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Override("Microsoft.AspNetCore", LogEventLevel.Warning) // menos ruído
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .WriteTo.Seq(seqUrl)
    .CreateLogger();

builder.Host.UseSerilog();

var app = builder.Build();

app.UseSerilogRequestLogging(opts => {
    opts.GetLevel = (ctx, elapsed, ex) => ex != null ? LogEventLevel.Error : LogEventLevel.Information;

    opts.EnrichDiagnosticContext = (diag, http) => {
        diag.Set("TraceId", Activity.Current?.Id ?? http.TraceIdentifier);
        diag.Set("Path", http.Request.Path);
        diag.Set("Method", http.Request.Method);
        diag.Set("UserAgent", http.Request.Headers.UserAgent.ToString());
        diag.Set("ClientIP", http.Connection.RemoteIpAddress?.ToString());

        // Mesmo cálculo do middleware (garante no evento de request)
        var userId =
            http.User?.FindFirst("usuario_id")?.Value ??
            http.User?.FindFirst("sub")?.Value ??
            (http.Items.TryGetValue("UsuarioId", out var v) ? v?.ToString() : null);

        if (!string.IsNullOrEmpty(userId))
            diag.Set("UsuarioId", userId);

        // status HTTP normal
        diag.Set("StatusCode", http.Response.StatusCode);

        // se você guarda o "status" do payload no Items:
        if (http.Items.TryGetValue("PayloadStatus", out var s))
            diag.Set("PayloadStatus", s);
    };
});

// Configurar middlewares
ConfigureMiddlewares(app);

// Executar aplicação
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

void ConfigureMiddlewares(WebApplication app) {
    app.UseMyExceptionHandler(app.Environment);
    app.UseMyMiddlewares(app.Environment);
    app.UseMyCors();
    app.UseHsts();
    app.UseHttpsRedirection();
    app.UseRouting();
    app.UseMyRequestLocalization();
    app.UseMySwagger(app.Configuration);
    app.UseMyEndpoints();
    app.UseResponseCompression();

    ConfigureEnvironmentSpecific(app);


    app.Use(async (ctx, next) => {
        var userId =
            ctx.User?.FindFirst("usuario_id")?.Value ??
            ctx.User?.FindFirst("sub")?.Value ??
            (ctx.Items.TryGetValue("UsuarioId", out var v) && v is string strValue ? strValue : null);

        using (LogContext.PushProperty("UsuarioId", userId ?? "anonimo")) {
            await next();
        }
    });
}

void ConfigureEnvironmentSpecific(WebApplication app) {
    var urls = app.Configuration.GetSection("Urls").Get<Dictionary<string, string>>();

    if (urls != null && urls.TryGetValue(app.Environment.EnvironmentName, out var environmentUrl)) {
        Log.Information("Configurando URL: {Url}", environmentUrl);
        app.Urls.Add(environmentUrl);
    }

    if (app.Environment.IsProduction()) {
        Log.Information("Aplicação rodando em produção.");
    }
    else {
        Log.Information("Aplicação rodando em homologação.");
    }
}
