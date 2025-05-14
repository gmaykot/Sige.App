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
            services.AddAutoMapper(typeof(ConcessionariaMapper));              
            services.AddAutoMapper(typeof(EmpresaMapper));              
            services.AddAutoMapper(typeof(FornecedorMapper));
            services.AddAutoMapper(typeof(UsuarioMapper));
            services.AddAutoMapper(typeof(GerencialMapper));
            services.AddAutoMapper(typeof(ContratoMapper));
            services.AddAutoMapper(typeof(GeralMapper));
            services.AddAutoMapper(typeof(FaturaEnergiaMapper));

            return services;
        }
    }
}
