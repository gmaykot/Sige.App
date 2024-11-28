using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SIGE.Core.Options;
using System.Net.Http.Headers;
using System.Security.Authentication;
using System.Security.Cryptography.X509Certificates;

namespace SIGE.Services.HttpConfiguration.Ccee
{
    public static class CceeHttpClientConfig
    {
        public static IServiceCollection AddCCEEHttpClient(this IServiceCollection services, IConfiguration config)
        {
            services.Configure<CceeOptions>(o => config.GetSection("Services:Ccee").Bind(o));
            var cceeOptions = config.GetSection("Services:Ccee").Get<CceeOptions>();

            _ = services.AddHttpClient<IHttpClient<CceeHttpClient>, CceeHttpClient>()
                .ConfigurePrimaryHttpMessageHandler(services =>
                {
                    var handler = new HttpClientHandler()
                    {
                        ClientCertificateOptions = ClientCertificateOption.Automatic,
                        SslProtocols = SslProtocols.Tls12 | SslProtocols.Tls13,
                        ServerCertificateCustomValidationCallback = HttpClientHandler.DangerousAcceptAnyServerCertificateValidator
                    };

                    X509Certificate2 certificate = null;

                    if (!string.IsNullOrEmpty(cceeOptions?.CertificateValue) && !cceeOptions.CertificateValue.Equals("${CERTIFICATE_VALUE}"))
                    {
                        Console.WriteLine("##SUCCESS: Certificate Injected");
                        byte[] certBytes = Convert.FromBase64String(cceeOptions.CertificateValue);
                        certificate = new X509Certificate2(certBytes);

                        if (certificate != null)
                            handler.ClientCertificates.Add(certificate);
                    } else
                    {
                        Console.WriteLine("##ERRO: Certificate Injected => {0}", cceeOptions?.CertificateValue);
                    }
                    return handler;
                })
                .SetHandlerLifetime(TimeSpan.FromMinutes(5))
                .ConfigureHttpClient((sp, client) =>
                {
                    client.Timeout = TimeSpan.FromMinutes(5);
                    client.BaseAddress = new Uri(cceeOptions.BaseUrl);

                    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("text/xml"));
                });

            return services;
        }

        //Buscar certificados instalados na máquina local
        public static X509Certificate2? GetCurrentUserCertificates(string serialNumber)
        {
            var certificates = new List<X509Certificate2>();
            var store = new X509Store(StoreName.My, StoreLocation.CurrentUser);
            store.Open(OpenFlags.OpenExistingOnly);
            var cert = store.Certificates.FirstOrDefault(c => c.GetSerialNumberString().Equals(serialNumber));
            store.Close();
            return cert;
        }
    }
}
