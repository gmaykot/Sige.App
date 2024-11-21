using Serilog;
using SIGE.Configuration;

var builder = WebApplication.CreateBuilder(args);

//TODO Implementar cache
builder.Services.AddMyCors();
builder.Services.AddMyRequestLocalizationOptions();
builder.Services.AddMyControllers();
builder.Services.AddMySwaggerGen(builder.Configuration);
builder.Services.AddMyDependencies(builder.Configuration);
builder.Services.AddMyDbContext(builder.Configuration);
builder.Services.AddMyOptions(builder.Configuration);
builder.Services.AddMyHostedService();

var app = builder.Build();
app.UseMyExceptionHandler(app.Environment);
app.UseMyMiddlewares(app.Environment);
app.UseMyCors();
app.UseHsts();
app.UseHttpsRedirection();
app.UseRouting();
app.UseMyRequestLocalization();
app.UseMySwagger(builder.Configuration);
app.UseMyEndpoints();

if (app.Environment.IsProduction() && false)
{
    builder.Host.UseSerilog((context, loggerConfig) =>
        loggerConfig.ReadFrom.Configuration(context.Configuration));

    app.UseSerilogRequestLogging();
}

if (app.Environment.IsStaging())
    builder.WebHost.UseUrls("https://0.0.0.0:5001");
if (app.Environment.IsProduction())
    builder.WebHost.UseUrls("https://0.0.0.0:5000");
if (app.Environment.IsDevelopment())
    builder.WebHost.UseUrls("http://localhost:5263");

app.Run();