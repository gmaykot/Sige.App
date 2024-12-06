using Microsoft.AspNetCore.ResponseCompression;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection.Extensions;
using SIGE.Core.Cache;
using SIGE.Core.Models.Requests;
using SIGE.Core.Options;
using SIGE.DataAccess.Context;
using SIGE.Services;
using SIGE.Services.Custom;
using SIGE.Services.Schedule;
using System.IO.Compression;

namespace SIGE.Configuration
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddMyCors(this IServiceCollection services) =>
            services.AddCors(Factory.CorsOptions);

        public static IServiceCollection AddMyRequestLocalizationOptions(this IServiceCollection services) =>
            services.Configure(Factory.RequestLocalizationOptions);

        public static IServiceCollection AddMyControllers(this IServiceCollection services)
        {
            services.AddControllers(options =>
            {
                options.Filters.Add(typeof(CustomAuthorizationFilter));
            }).AddNewtonsoftJson(Factory.MvcNewtonsoftJsonOptions);
            return services;
        }
        public static IServiceCollection AddMySwaggerGen(this IServiceCollection services, IConfiguration config)
        {
            services.AddSwaggerGen(SwaggerOptionsFactory.CreateGen(config));
            return services;
        }

        public static IServiceCollection AddMyDependencies(this IServiceCollection services, IConfiguration config)
        {
            services.AddMyServices(config);
            services.AddMyAutoMapper();
            services.TryAddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            services.TryAddSingleton<ICustomLoggerService, CustomLoggerService>();
            services.TryAddSingleton<ICacheManager, CacheManager>();
            services.TryAddScoped<RequestContext>();

            return services;
        }

        public static IServiceCollection AddMyDbContext(this IServiceCollection services, IConfiguration config)
        {
            var connectionString = config.GetConnectionString("DefaultConnection");
            services.AddDbContext<AppDbContext>(options =>
            {
                options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString));
            });
            return services;
        }

        public static IServiceCollection AddMyOptions(this IServiceCollection services, IConfiguration config)
        {
            services.Configure<CacheOption>(config.GetSection("Cache"));
            services.Configure<CceeOption>(config.GetSection("Services:Ccee"));
            services.Configure<EmailSettingsOption>(config.GetSection("Email"));
            services.Configure<SystemOption>(config.GetSection("System"));
            return services;
        }

        public static IServiceCollection AddMyHostedService(this IServiceCollection services)
        {
            services.AddHostedService<MedicaoCCEEScheduleService>();
            services.AddScoped<MedicaoCCEEScheduleEscoped>();

            return services;
        }

        public static IServiceCollection AddMyCompression(this IServiceCollection services)
        {
            services.AddResponseCompression(options =>
            {
                options.EnableForHttps = true;
                options.Providers.Add<GzipCompressionProvider>();
            });

            services.Configure<GzipCompressionProviderOptions>(options =>
            {
                options.Level = CompressionLevel.Optimal;
            });

            return services;
        }
    }
}
