using Serilog;
using SIGE.Configuration;

var builder = WebApplication.CreateBuilder(args);

// Configurar logs com Serilog
//builder.Host.UseSerilog((context, loggerConfig) =>
//    loggerConfig.ReadFrom.Configuration(context.Configuration));

// Configurar serviços
ConfigureServices(builder);

var app = builder.Build();

// Configurar middlewares
ConfigureMiddlewares(app);

// Executar aplicação
app.Run();

void ConfigureServices(WebApplicationBuilder builder)
{
    builder.Services.AddMemoryCache(); // Adiciona cache em memória
    builder.Services.AddMyCors();
    builder.Services.AddMyRequestLocalizationOptions();
    builder.Services.AddMyControllers();
    builder.Services.AddMySwaggerGen(builder.Configuration);
    builder.Services.AddMyDependencies(builder.Configuration);
    builder.Services.AddMyDbContext(builder.Configuration);
    builder.Services.AddMyOptions(builder.Configuration);
    builder.Services.AddMyHostedService();
}

void ConfigureMiddlewares(WebApplication app)
{
    app.UseMyExceptionHandler(app.Environment);
    app.UseMyMiddlewares(app.Environment);
    app.UseMyCors();
    app.UseHsts();
    app.UseHttpsRedirection();
    app.UseRouting();
    app.UseMyRequestLocalization();
    app.UseMySwagger(app.Configuration);
    app.UseMyEndpoints();

    ConfigureEnvironmentSpecific(app);
}

void ConfigureEnvironmentSpecific(WebApplication app)
{
    var urls = app.Configuration.GetSection("Urls").Get<Dictionary<string, string>>();

    if (urls != null && urls.TryGetValue(app.Environment.EnvironmentName, out var environmentUrl))
    {
        app.Logger.LogInformation("Configurando URL: {Url}", environmentUrl);
        app.Urls.Add(environmentUrl);
    }

    if (app.Environment.IsProduction())
    {
        //app.UseSerilogRequestLogging();
        app.Logger.LogInformation("Aplicação rodando em produção.");
    }
}
