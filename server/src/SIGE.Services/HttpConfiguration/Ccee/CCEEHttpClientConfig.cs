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
            CceeOption option = config.GetSection("Services:Ccee").Get<CceeOption>();

            _ = services.AddHttpClient<IHttpClient<CceeHttpClient>, CceeHttpClient>()
                .ConfigurePrimaryHttpMessageHandler(services =>
                {
                    var handler = new HttpClientHandler()
                    {
                        ClientCertificateOptions = ClientCertificateOption.Manual,
                        SslProtocols = SslProtocols.Tls12 | SslProtocols.Tls13,
                        ServerCertificateCustomValidationCallback = (sender, certificate, chaim, errors) => true
                    };


                    if (!string.IsNullOrEmpty(option?.CertificateValue) && !option.CertificateValue.Equals("${CERTIFICATE_VALUE}"))
                    {
                        byte[] certBytes = Convert.FromBase64String(option.CertificateValue);
                        var certificatePem = new X509Certificate2(certBytes, option.CertificatePass);

                        if (certificatePem != null)
                        {
                            Console.WriteLine("##SUCCESS: Certificate Injected");
                            handler.ClientCertificates.Add(certificatePem);
                        }

                    } else
                    {
                        Console.WriteLine("##ERRO: Certificate Value => {0}", option?.CertificateValue);
                    }
                    return handler;
                })
                .SetHandlerLifetime(TimeSpan.FromMinutes(5))
                .ConfigureHttpClient((sp, client) =>
                {
                    client.Timeout = TimeSpan.FromMinutes(5);
                    client.BaseAddress = new Uri(option.BaseUrl);
                    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("text/xml"));
                });

            return services;
        }
    }
}
