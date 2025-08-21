using System.Net.Http.Headers;
using System.Security.Authentication;
using System.Security.Cryptography.X509Certificates;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Serilog;
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

                    try {
                        var raw = option?.CertificateValue;
                        var pwd = option?.CertificatePass;

                        if (!string.IsNullOrWhiteSpace(raw) && raw != "${CERTIFICATE_VALUE}") {
                            // Remove espaços/linhas que às vezes vêm do painel:
                            var b64 = raw.Trim().Replace("\n", "").Replace("\r", "");
                            var pfxBytes = Convert.FromBase64String(b64);

                            // Flags essenciais no Linux:
                            var cert = new X509Certificate2(
                                pfxBytes,
                                pwd,
                                X509KeyStorageFlags.MachineKeySet |
                                X509KeyStorageFlags.EphemeralKeySet |
                                X509KeyStorageFlags.Exportable);

                            handler.ClientCertificates.Add(cert);
                            Log.Information("Certificado de cliente carregado e anexado ao HttpClientHandler.");
                        }
                        else {
                            Log.Error("CLIENTE CCEE: CertificateValue ausente ou placeholder.");
                        }
                    }
                    catch (Exception ex) {
                        Log.Error(ex, "Falha ao carregar o certificado de cliente CCEE (PFX).");
                        throw;
                    }

                    return handler;
                })
                .SetHandlerLifetime(TimeSpan.FromMinutes(5))
                .ConfigureHttpClient((sp, client) => {
                    client.Timeout = TimeSpan.FromMinutes(5);
                    client.BaseAddress = new Uri(option!.BaseUrl);
                    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("text/xml"));
                });

            return services;
        }
    }
}
