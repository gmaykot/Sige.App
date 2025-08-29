using Serilog;

namespace SIGE.Core.AppLogger {
    public sealed class AppLogger : IAppLogger {
        private readonly ILogger _log;
        public AppLogger() {
            _log = Log.ForContext<AppLogger>();
        }

        public void LoginSuccess(string usuario, bool success = true, string motivo = "") {
            var logger = _log.ForContext("EventName", LogEvents.Login);

            if (!string.IsNullOrEmpty(usuario))
                _log.ForContext("Motivo", motivo);

            if (success) {
                logger.Information("{Icon} Usuário {Usuario} logado com sucesso.",
                    LogIcons.Login, usuario);
            }
            else {
                logger.Warning("{Icon} Tentativa de login falhou para {Usuario}.", LogIcons.Error, usuario);
            }
        }

        public void ClientCertWithoutEku() {
            _log
                .ForContext("EventName", LogEvents.ClientCertNoEKU)
                .Warning("{Icon} Cert cliente sem EKU de Client Authentication (1.3.6.1.5.5.7.3.2); servidor pode recusar.", LogIcons.Alert);
        }

        public void ClientCertLoaded(string subject) {
            _log
                .ForContext("EventName", LogEvents.ClientCertLoaded)
                .Information("{Icon} Certificado de cliente carregado e cadeia anexada ao HttpClientHandler (CN={Subject}).",
                    LogIcons.Alert, subject);
        }

        public void ClientWithoutCert(string certValue) {
            _log
                .ForContext("EventName", LogEvents.ClientCertNoEKU)
                .Warning("{Icon} CLIENTE CCEE: CertificateValue ausente ou placeholder ({CertValue}).", LogIcons.Alert, certValue);
        }

        public void LogError(string message, Guid? objectId = null) {
            if (objectId.HasValue)
                _log.ForContext("ObjectId", objectId.Value);

            _log.Error(message);
        }

        public void LogWarning(string message, Guid? objectId = null) {
            if (objectId.HasValue)
                _log.ForContext("ObjectId", objectId.Value);

            _log.Warning(message);
        }

        public void LogInformation(string message, Guid? objectId = null) {
            if (objectId.HasValue)
                _log.ForContext("ObjectId", objectId.Value);

            _log.Information(message);
        }
    }
}
