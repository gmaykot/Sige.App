using Microsoft.AspNetCore.Localization;
using Microsoft.AspNetCore.Rewrite;
using System.Diagnostics.CodeAnalysis;
using System.Globalization;

namespace SIGE.Configuration
{
    [ExcludeFromCodeCoverage]
    public static class ApplicationBuilderExtensions
    {
        public static IApplicationBuilder UseMyCors(this IApplicationBuilder app) =>
            app.UseCors("CorsPolicy");

        public static IApplicationBuilder UseMyExceptionHandler(this IApplicationBuilder app, IWebHostEnvironment env) =>
            env.IsDevelopment() ? app.UseDeveloperExceptionPage() : app.UseExceptionHandler(Factory.ExceptionHandler);

        public static IApplicationBuilder UseMyEndpoints(this IApplicationBuilder app) =>
            app.UseEndpoints(endpoints => endpoints.MapControllers());

        public static IApplicationBuilder UseMySwagger(this IApplicationBuilder app, IConfiguration config)
        {
            app.UseSwagger()
               .UseSwaggerUI(SwaggerOptionsFactory.CreateUi(config))
               .UseRewriter(new RewriteOptions().AddRedirect("^$", "swagger"));
            return app;
        }

        public static IApplicationBuilder UseMyRequestLocalization(this IApplicationBuilder app)
        {
            CultureInfo.DefaultThreadCurrentCulture = CultureInfo.CreateSpecificCulture("pt-BR");

            var supportedCultures = new[]{
                new CultureInfo("pt-BR")
            };
            app.UseRequestLocalization(new RequestLocalizationOptions
            {
                DefaultRequestCulture = new RequestCulture(culture: "pt-BR", uiCulture: "pt-BR"),
                SupportedCultures = supportedCultures,
                SupportedUICultures = supportedCultures,
                FallBackToParentCultures = false
            });

            return app;
        }

        public static IApplicationBuilder UseMyMiddlewares(this IApplicationBuilder app, IWebHostEnvironment env)
        {

            //if (!env.IsDevelopment())
                //app.UseMiddleware<CertificateValidationMiddleware>();

            return app;
        }
           
    }
}
