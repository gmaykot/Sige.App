using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;
using Swashbuckle.AspNetCore.SwaggerUI;
using System.Diagnostics.CodeAnalysis;

namespace SIGE.Configuration
{
    [ExcludeFromCodeCoverage]
    public static class SwaggerOptionsFactory
    {
        public static Action<SwaggerGenOptions> CreateGen(IConfiguration config)
        {
            var openApiInfo = new OpenApiInfo
            {
                Title = $"API´s {config["swagger:scope"]}",
                Version = "v1",
                Description = $"Soluções Inteligentes para Gestão de Energia",
            };

            return options => {
                options.SwaggerDoc("v1", openApiInfo);
                options.ResolveConflictingActions(apiDescriptions => apiDescriptions.First());
                options.OrderActionsBy(d => d.GroupName);
                options.EnableAnnotations();
                options.DescribeAllParametersInCamelCase();
                options.SupportNonNullableReferenceTypes();
                options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.ApiKey,
                    Scheme = "Bearer"
                });

                options.AddSecurityRequirement(new OpenApiSecurityRequirement()
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            },
                            Scheme = "oauth2",
                            Name = "Bearer",
                            In = ParameterLocation.Header,
                        },
                        new List<string>()
                    }
                });
            };
        }

        public static Action<SwaggerUIOptions> CreateUi(IConfiguration config)
        {
            return options => {
                options.DocExpansion(DocExpansion.None);
                options.SwaggerEndpoint(config["swagger:path"], $"API´s {config["swagger:scope"]}");
                options.DisplayRequestDuration();
                options.DefaultModelsExpandDepth(0);
                options.DefaultModelExpandDepth(1);
                options.DefaultModelRendering(ModelRendering.Example);
                options.EnableDeepLinking();
            };
        }
    }
}
