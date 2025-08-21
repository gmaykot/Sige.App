using System.Net.Http.Headers;
using System.Security.Authentication;
using System.Security.Cryptography;
using System.Security.Cryptography.X509Certificates;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SIGE.Core.Options;

namespace SIGE.Services.HttpConfiguration.Ccee {
    public static class CceeHttpClientConfig {
        public static IServiceCollection AddCCEEHttpClient(this IServiceCollection services, IConfiguration config) {
            var option = config.GetSection("Services:Ccee").Get<CceeOption>();

            services.AddHttpClient<IHttpClient<CceeHttpClient>, CceeHttpClient>()
                .ConfigurePrimaryHttpMessageHandler(sp => {
                    var handler = new HttpClientHandler {
                        ClientCertificateOptions = ClientCertificateOption.Manual,
                        SslProtocols = SslProtocols.Tls12, // isola problemas de TLS1.3
                                                           // ATENÇÃO: só para teste/homolog; remova em produção:
                        ServerCertificateCustomValidationCallback = HttpClientHandler.DangerousAcceptAnyServerCertificateValidator
                    };

                    try {
                        var raw = option?.CertificateValue;
                        var pwd = option?.CertificatePass;

                        if (!string.IsNullOrWhiteSpace(raw) && raw != "${CERTIFICATE_VALUE}") {
                            // normaliza base64
                            var b64 = raw.Trim().Replace("\n", "").Replace("\r", "");
                            var pfxBytes = Convert.FromBase64String(b64);

                            // Importa a COLEÇÃO (leaf + intermediárias) com flags Linux-friendly
                            var col = new X509Certificate2Collection();
                            col.Import(
                                pfxBytes,
                                pwd,
                                X509KeyStorageFlags.MachineKeySet |
                                X509KeyStorageFlags.EphemeralKeySet |
                                X509KeyStorageFlags.Exportable);

                            // Anexa TODOS os certs ao handler (o leaf com private key será usado no mTLS)
                            foreach (var c in col)
                                handler.ClientCertificates.Add(c);

                            // sanity check: precisa haver um com chave privada
                            var leaf = col.Cast<X509Certificate2>().FirstOrDefault(c => c.HasPrivateKey);
                            if (leaf == null)
                                throw new InvalidOperationException("PFX não contém chave privada.");

                            // (Opcional) alerta se faltar EKU de Client Authentication
                            var hasClientAuthEku = leaf.Extensions
                                .OfType<X509EnhancedKeyUsageExtension>()
                                .SelectMany(e => e.EnhancedKeyUsages.Cast<Oid>())
                                .Any(oid => oid?.Value == "1.3.6.1.5.5.7.3.2");
                            if (!hasClientAuthEku)
                                Serilog.Log.Warning("Cert cliente sem EKU de Client Authentication (1.3.6.1.5.5.7.3.2); servidor pode recusar.");

                            Serilog.Log.Information("Certificado de cliente carregado e cadeia anexada ao HttpClientHandler (CN={Subject}).", leaf.Subject);
                        }
                        else {
                            Serilog.Log.Error("CLIENTE CCEE: CertificateValue ausente ou placeholder.");
                        }
                    }
                    catch (Exception ex) {
                        Serilog.Log.Error(ex, "Falha ao carregar/anexar certificado cliente (PFX).");
                        throw;
                    }

                    return handler;
                })
.SetHandlerLifetime(TimeSpan.FromMinutes(5))
.ConfigureHttpClient((sp, client) => {
    client.Timeout = TimeSpan.FromMinutes(5);
    client.BaseAddress = new Uri(option!.BaseUrl);
    client.DefaultRequestVersion = new Version(1, 1); // força HTTP/1.1 (evita ALPN/http2 em appliances antigos)
    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("text/xml"));
});

            return services;
        }
    }
}
