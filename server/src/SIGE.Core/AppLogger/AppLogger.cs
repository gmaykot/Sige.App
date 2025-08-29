using Serilog;

namespace SIGE.Core.AppLogger {
    public sealed class AppLogger : IAppLogger {
        private readonly ILogger _log;
        public AppLogger() {
            _log = Log.ForContext<AppLogger>();
        }

        public void LoginSuccess(string usuarioApelido, string usuarioId, bool success = true, string motivo = "") {
            var logger = _log.ForContext("EventName", LogEvents.Login);

            if (success) {
                logger.Information("✅ Usuário {Usuario} ({UsuarioId}) logado com sucesso." + (motivo != "" ? " ({Motivo})" : ""),
                    usuarioApelido, usuarioId, motivo);
            }
            else {
                logger.Warning("❌ Tentativa de login falhou para {Usuario}." + (motivo != "" ? " ({Motivo})" : ""), usuarioApelido, motivo);
            }
        }

        public void ClientCertWithoutEku() {
            _log
                .ForContext("EventName", LogEvents.ClientCertNoEKU)
                .Warning("🚨 Cert cliente sem EKU de Client Authentication (1.3.6.1.5.5.7.3.2); servidor pode recusar.");
        }

        public void ClientCertLoaded(string subject) {
            _log
                .ForContext("EventName", LogEvents.ClientCertLoaded)
                .Information("Certificado de cliente carregado e cadeia anexada ao HttpClientHandler (CN={Subject}).",
                    subject);
        }

        public void ClientWithoutCert(string certValue) {
            _log
                .ForContext("EventName", LogEvents.ClientCertNoEKU)
                .Warning("🚨 CLIENTE CCEE: CertificateValue ausente ou placeholder ({CertValue}).", certValue);
        }

        public void LogError(string message) {
            _log.Error(message);
        }

        public void LogWarning(string message) {
            _log.Warning(message);
        }

        public void LogInformation(string message) {
            _log.Information(message);
        }
    }
}
