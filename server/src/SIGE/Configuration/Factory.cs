using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.AspNetCore.Localization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Serialization;
using Newtonsoft.Json;
using System.Globalization;
using SIGE.Core.Models.Defaults;
using System.Net;

namespace SIGE.Configuration
{
    public static class Factory
    {
        public static Action<CorsOptions> CorsOptions
        {
            get {
                var corsPolicy = new CorsPolicyBuilder()
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .AllowAnyOrigin()
                    .Build();

                return options => options.AddPolicy("CorsPolicy", corsPolicy);
            }
        }

        public static Action<RequestLocalizationOptions> RequestLocalizationOptions
        {
            get
            {
                return options =>
                {
                    options.DefaultRequestCulture = new RequestCulture("pt-BR");
                    options.SupportedCultures = new List<CultureInfo> { new CultureInfo("pt-BR") };
                };
            }
        }

        public static Action<MvcNewtonsoftJsonOptions> MvcNewtonsoftJsonOptions
        {
            get
            {
                var settings = new JsonSerializerSettings
                    {
                        ContractResolver = new DefaultContractResolver
                        {
                            NamingStrategy = new CamelCaseNamingStrategy(),
                        },
                    };

                return options => {
                    options.SerializerSettings.Converters = settings.Converters;
                    options.SerializerSettings.Formatting = settings.Formatting;
                    options.SerializerSettings.ContractResolver = settings.ContractResolver;
                    options.SerializerSettings.NullValueHandling = NullValueHandling.Ignore;
                };
            }
        }

        public static JsonSerializerSettings JsonSerializerSettings
        {
            get
            {
                return new JsonSerializerSettings
                {
                    ContractResolver = new DefaultContractResolver
                    {
                        NamingStrategy = new CamelCaseNamingStrategy(),
                    },
                };
            }            
        }

        public static ExceptionHandlerOptions ExceptionHandler
        {
            get
            {
                return new ExceptionHandlerOptions
                {
                    ExceptionHandler = Handle,
                    ExceptionHandlingPath = null
                };
            }
        }

        private static async Task Handle(this HttpContext context)
        {
            context.Response.StatusCode = 500;
            context.Response.ContentType = "application/json";
            var err = new Response(HttpStatusCode.InternalServerError);
            var settings = JsonSerializerSettings;
            var result = JsonConvert.SerializeObject(err, settings);
            await context.Response.WriteAsync(result).ConfigureAwait(false);
        }
    }
}
