namespace SIGE.Core.AppLogger {
    public static class LogIcons {
        public const string Startup = "🚀";
        public const string Login = "👤";
        public const string Auth = "🔑";
        public const string Docs = "📄";
        public const string Http = "🌐";
        public const string Db = "🗄️";
        public const string Success = "✅";
        public const string Warning = "⚠️";
        public const string Error = "❌";
        public const string Alert = "🚨";
    }

    public static class LogEvents {
        public const string Startup = "Startup";
        public const string LoginSuccess = "LoginSuccess";
        public const string LoginFailed = "LoginFailed";
        public const string AuthGranted = "AuthGranted";
        public const string AuthDenied = "AuthDenied";
        public const string DocumentCreated = "DocumentCreated";
        public const string DocumentUpdated = "DocumentUpdated";
        public const string DocumentDeleted = "DocumentDeleted";
        public const string HttpRequest = "HttpRequest";
        public const string UnhandledError = "UnhandledError";
        public const string ClientCertNoEKU = "ClientCertNoEKU";
        public const string ClientCertLoaded = "ClientCertLoaded";
        public const string Login = "Login";
    }
}
