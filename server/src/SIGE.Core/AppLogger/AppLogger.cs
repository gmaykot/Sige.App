using Serilog;
using Serilog.Events;
using SIGE.Core.Models.Requests;

namespace SIGE.Core.AppLogger {
    public sealed class AppLogger : IAppLogger {
        private readonly ILogger _log;
        private readonly RequestContext _requestContext;

        public AppLogger(RequestContext requestContext) {
            _log = Log.ForContext<AppLogger>();
            _requestContext = requestContext;
        }

        public void LoginSuccess(string usuario, bool success = true, string motivo = "") {
            var logger = _log.ForContext("EventName", LogEvents.Login);

            if (!string.IsNullOrEmpty(motivo))
                logger = logger.ForContext("Motivo", motivo);

            var logMessage = success
                ? "{Icon} Usuário {Usuario} logado com sucesso."
                : "{Icon} Tentativa de login falhou para {Usuario}.";

            logger.Write(success ? LogEventLevel.Information : LogEventLevel.Error, logMessage,
                success ? LogIcons.Success : LogIcons.Error, usuario);
        }

        public void ClientCertWithoutEku() {
            LogWithContext(LogEvents.ClientCertNoEKU, LogIcons.Alert,
                "{Icon} Cert cliente sem EKU de Client Authentication (1.3.6.1.5.5.7.3.2); servidor pode recusar.");
        }

        public void ClientCertLoaded(string subject) {
            LogWithContext(LogEvents.ClientCertLoaded, LogIcons.Alert,
                "{Icon} Certificado de cliente carregado e cadeia anexada ao HttpClientHandler (CN={Subject}).", subject);
        }

        public void ClientWithoutCert(string certValue) {
            LogWithContext(LogEvents.ClientCertNoEKU, LogIcons.Alert,
                "{Icon} CLIENTE CCEE: CertificateValue ausente ou placeholder ({CertValue}).", certValue);
        }

        public void LogError(string message, Guid? objectId = null) {
            LogWithOptionalObjectId(LogIcons.Error, message, objectId, LogEventLevel.Error);
        }

        public void LogWarning(string message, Guid? objectId = null) {
            LogWithOptionalObjectId(LogIcons.Warning, message, objectId, LogEventLevel.Warning);
        }

        public void LogInformation(string message, Guid? objectId = null) {
            LogWithOptionalObjectId(LogIcons.Information, message, objectId, LogEventLevel.Information);
        }

        private void LogWithContext(string eventName, string icon, string messageTemplate, params object[] args) {
            _log.ForContext("EventName", eventName)
                .ForContext("Usuario", _requestContext.Usuario)
                .Write(LogEventLevel.Information, messageTemplate, icon, args);
        }

        private void LogWithOptionalObjectId(string icon, string message, Guid? objectId, LogEventLevel level) {
            var logger = _log.ForContext("Usuario", _requestContext.Usuario);

            if (objectId.HasValue)
                logger = logger.ForContext("ObjectId", objectId.Value);

            logger.Write(level, "{Icon} {Message}", icon, message);
        }

        public void LogDeleteObject(string message, Guid? objectId) {
            var logger = _log.ForContext("Usuario", _requestContext.Usuario);

            if (objectId.HasValue)
                logger = logger.ForContext("ObjectId", objectId.Value);

            logger.Write(LogEventLevel.Warning, "{Icon} {Message}", LogIcons.Delete, message);
        }
    }
}
