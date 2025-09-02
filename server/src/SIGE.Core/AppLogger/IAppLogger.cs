namespace SIGE.Core.AppLogger {
    public interface IAppLogger {
        void ClientCertLoaded(string subject);
        void ClientCertWithoutEku();
        void ClientWithoutCert(string certValue);
        void LogDeleteObject(string message, Guid? objectId);
        void LogError(string message, Guid? objectId = null);
        void LogInformation(string message, Guid? objectId = null);
        void LogWarning(string message, Guid? objectId = null);
        void LoginSuccess(string usuario, bool success = true, string motivo = "");
    }
}
