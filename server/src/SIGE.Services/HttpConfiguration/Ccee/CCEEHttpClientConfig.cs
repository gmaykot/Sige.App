using System.Net.Http.Headers;
using System.Security.Authentication;
using System.Security.Cryptography;
using System.Security.Cryptography.X509Certificates;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SIGE.Core.AppLogger;
using SIGE.Core.Options;

namespace SIGE.Services.HttpConfiguration.Ccee
{
    public static class CceeHttpClientConfig
    {
        public static IServiceCollection AddCCEEHttpClient(
            this IServiceCollection services,
            IConfiguration config
        )
        {
            var option = config.GetSection("Services:Ccee").Get<CceeOption>();

            services
                .AddHttpClient<IHttpClient<CceeHttpClient>, CceeHttpClient>()
                .ConfigurePrimaryHttpMessageHandler(sp =>
                {
                    var handler = new HttpClientHandler
                    {
                        ClientCertificateOptions = ClientCertificateOption.Manual,
                        SslProtocols = SslProtocols.Tls12,
                        ServerCertificateCustomValidationCallback =
                            HttpClientHandler.DangerousAcceptAnyServerCertificateValidator
                    };
                    var logger = sp.GetRequiredService<IAppLogger>();

                    try
                    {
                        var raw = option?.CertificateValue;
                        var pwd = option?.CertificatePass;

                        if (!string.IsNullOrWhiteSpace(raw) && raw != "${CERTIFICATE_VALUE}")
                        {
                            var b64 = raw.Trim().Replace("\n", "").Replace("\r", "");
                            var pfxBytes = Convert.FromBase64String(b64);

                            // Flags corretas conforme o SO
                            var flags = OperatingSystem.IsWindows()
                                ? X509KeyStorageFlags.MachineKeySet
                                    | X509KeyStorageFlags.PersistKeySet
                                    | X509KeyStorageFlags.Exportable
                                : X509KeyStorageFlags.EphemeralKeySet
                                    | X509KeyStorageFlags.Exportable;

                            var cert = new X509Certificate2(pfxBytes, pwd, flags);

                            if (!cert.HasPrivateKey)
                                throw new InvalidOperationException(
                                    "PFX não contém chave privada."
                                );

                            // (Opcional) valida EKU ClientAuth
                            var hasClientAuthEku = cert
                                .Extensions.OfType<X509EnhancedKeyUsageExtension>()
                                .SelectMany(e => e.EnhancedKeyUsages.Cast<Oid>())
                                .Any(oid => oid?.Value == "1.3.6.1.5.5.7.3.2");

                            if (!hasClientAuthEku)
                                logger.LogWarning(
                                    "Certificado cliente não possui EKU de ClientAuth."
                                );

                            // Adiciona apenas o leaf
                            handler.ClientCertificates.Add(cert);
                            logger.LogInformation($"Certificado cliente carregado: {cert.Subject}");
                            logger.LogInformation(
                                $"KeyAlg={cert.GetKeyAlgorithm()}, SigAlg={cert.SignatureAlgorithm.FriendlyName}"
                            );
                        }
                        else
                        {
                            logger.LogWarning("Nenhum certificado cliente configurado.");
                        }
                    }
                    catch (Exception ex)
                    {
                        logger.LogError(ex.Message);
                        throw;
                    }

                    return handler;
                })
                .AddHttpMessageHandler<UserScopeHandler>()
                .SetHandlerLifetime(TimeSpan.FromMinutes(5))
                .ConfigureHttpClient(
                    (sp, client) =>
                    {
                        client.Timeout = TimeSpan.FromMinutes(5);
                        client.BaseAddress = new Uri(option!.BaseUrl);
                        client.DefaultRequestVersion = new Version(1, 1);
                        client.DefaultRequestHeaders.Accept.Add(
                            new MediaTypeWithQualityHeaderValue("text/xml")
                        );
                    }
                );

            return services;
        }
    }
}
