namespace SIGE.Core.AppLogger {
    public interface IAppLogger {
        void LogError(string message);
        void LogWarning(string message);
        void LogInformation(string message);
        void LoginSuccess(string usuarioApelido, string usuarioId, bool success = true, string motivo = "");
        void ClientCertWithoutEku();
        void ClientWithoutCert(string certValue);
        void ClientCertLoaded(string subject);
    }
}
