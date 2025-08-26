using AutoMapper;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SIGE.Core.Mapper;
using SIGE.Services.HttpConfiguration.Ccee;
using System.Reflection;

namespace SIGE.Services
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddMyServices(this IServiceCollection services, IConfiguration config)
        {
            var servicesAssembly = Assembly.GetAssembly(typeof(DependencyInjection)) ?? Assembly.GetExecutingAssembly();

            services.AddCCEEHttpClient(config);
                        
            services.Scan(scan => scan
                .FromAssemblies(servicesAssembly)
                .AddClasses(c => c.Where(x => x.Name.EndsWith("Service", StringComparison.OrdinalIgnoreCase)))
                .AsImplementedInterfaces()
                .WithTransientLifetime());
            return services;
        }

        public static IServiceCollection AddMyAutoMapper(this IServiceCollection services)
        {
            var coreAssembly = Assembly.GetAssembly(typeof(UsuarioMapper)) ?? Assembly.GetExecutingAssembly();

            services.Scan(scan => scan
                .FromAssemblies(coreAssembly)
                .AddClasses(c => c.Where(x => x.Name.EndsWith("Mapper", StringComparison.OrdinalIgnoreCase)))
                .As<Profile>()
                .WithSingletonLifetime());

            services.AddAutoMapper(coreAssembly);


            return services;
        }
    }
}
