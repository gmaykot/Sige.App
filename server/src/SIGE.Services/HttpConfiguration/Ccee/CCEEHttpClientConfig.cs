using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using Org.BouncyCastle.Asn1.Ocsp;
using Org.BouncyCastle.Tls;
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
                        ClientCertificateOptions = ClientCertificateOption.Manual,
                        SslProtocols = SslProtocols.Tls12 | SslProtocols.Tls13,
                        ServerCertificateCustomValidationCallback = (sender, certificate, chaim, errors) => true
                    };


                    if (!string.IsNullOrEmpty(cceeOptions?.CertificateValue) && !cceeOptions.CertificateValue.Equals("${CERTIFICATE_VALUE}"))
                    {
                        Console.WriteLine("##SUCCESS: Certificate Injected");
                        //Console.WriteLine("##SUCCESS: Certificate Options {0}", JsonConvert.SerializeObject(cceeOptions));
                        byte[] certBytes = Convert.FromBase64String(cceeOptions.CertificateValue);
                        var certificatePem = new X509Certificate2(certBytes, cceeOptions.CertificatePass);

                        if (certificatePem != null)
                        {
                            Console.WriteLine("##SUCCESS: certificatePem {0} - {1}", certificatePem.SerialNumber, certificatePem.IssuerName);
                            handler.ClientCertificates.Add(certificatePem);
                        }

                        Console.WriteLine("##SUCCESS: ClientCertificates Size {0}", handler.ClientCertificates.Count);
                    } else
                    {
                        Console.WriteLine("##ERRO: Certificate Value => {0}", cceeOptions?.CertificateValue);
                    }
                    return handler;
                })
                .SetHandlerLifetime(TimeSpan.FromMinutes(5))
                .ConfigureHttpClient((sp, client) =>
                {
                    client.Timeout = TimeSpan.FromMinutes(5);
                    client.BaseAddress = new Uri(cceeOptions.BaseUrl);
                    byte[] certBytes = Convert.FromBase64String(cceeOptions.CertificateValue);
                    var certificatePem = new X509Certificate2(certBytes, cceeOptions.CertificatePass);

                    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("text/xml"));
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", Convert.ToBase64String(certificatePem.Export(X509ContentType.Cert)));
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
