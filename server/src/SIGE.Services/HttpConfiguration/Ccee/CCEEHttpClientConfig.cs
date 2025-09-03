using System.Net.Http.Headers;
using System.Security.Authentication;
using System.Security.Cryptography;
using System.Security.Cryptography.X509Certificates;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SIGE.Core.AppLogger;
using SIGE.Core.Options;

namespace SIGE.Services.HttpConfiguration.Ccee {
    public static class CceeHttpClientConfig {
        public static IServiceCollection AddCCEEHttpClient(this IServiceCollection services, IConfiguration config) {
            var option = config.GetSection("Services:Ccee").Get<CceeOption>();

            services.AddHttpClient<IHttpClient<CceeHttpClient>, CceeHttpClient>()
                .ConfigurePrimaryHttpMessageHandler(sp => {
                    var handler = new HttpClientHandler {
                        ClientCertificateOptions = ClientCertificateOption.Manual,
                        SslProtocols = SslProtocols.Tls12,
                        ServerCertificateCustomValidationCallback = HttpClientHandler.DangerousAcceptAnyServerCertificateValidator
                    };
                    var logger = sp.GetRequiredService<IAppLogger>();

                    try {
                        var raw = option?.CertificateValue;
                        var pwd = option?.CertificatePass;

                        if (!string.IsNullOrWhiteSpace(raw) && raw != "${CERTIFICATE_VALUE}") {
                            var b64 = raw.Trim().Replace("\n", "").Replace("\r", "");
                            var pfxBytes = Convert.FromBase64String(b64);

                            var col = new X509Certificate2Collection();
                            col.Import(
                                pfxBytes,
                                pwd,
                                X509KeyStorageFlags.MachineKeySet |
                                X509KeyStorageFlags.EphemeralKeySet |
                                X509KeyStorageFlags.Exportable);

                            foreach (var c in col)
                                handler.ClientCertificates.Add(c);

                            var leaf = col.Cast<X509Certificate2>().FirstOrDefault(c => c.HasPrivateKey) ?? throw new InvalidOperationException("PFX não contém chave privada.");
                            var hasClientAuthEku = leaf.Extensions
                                .OfType<X509EnhancedKeyUsageExtension>()
                                .SelectMany(e => e.EnhancedKeyUsages.Cast<Oid>())
                                .Any(oid => oid?.Value == "1.3.6.1.5.5.7.3.2");
                            if (!hasClientAuthEku)
                                logger.ClientCertWithoutEku();

                            logger.ClientCertLoaded(leaf.Subject);
                        }
                        else {
                            logger.ClientWithoutCert(raw);
                        }
                    }
                    catch (Exception ex) {
                        logger.LogError(ex.Message);
                        throw;
                    }

                    return handler;
                })
                .AddHttpMessageHandler<UserScopeHandler>()
                .SetHandlerLifetime(TimeSpan.FromMinutes(5))
                .ConfigureHttpClient((sp, client) => {
                    client.Timeout = TimeSpan.FromMinutes(5);
                    client.BaseAddress = new Uri(option!.BaseUrl);
                    client.DefaultRequestVersion = new Version(1, 1);
                    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("text/xml"));
                });

            return services;
        }
    }
}
