using SIGE.Configuration;

var builder = WebApplication.CreateBuilder(args);

// Configurar servi�os
ConfigureServices(builder);

var app = builder.Build();

// Configurar middlewares
ConfigureMiddlewares(app);

// Executar aplica��o
app.Run();

void ConfigureServices(WebApplicationBuilder builder)
{
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
    app.UseResponseCompression();

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
        app.Logger.LogInformation("Aplica��o rodando em produ��o.");
    } else
    {
        app.Logger.LogInformation("Aplica��o rodando em homologa��o.");
    }
}
