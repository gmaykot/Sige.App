using Microsoft.AspNetCore.Http;
using Serilog.Context;

namespace SIGE.Core.AppLogger {
    public sealed class UserScopeHandler : DelegatingHandler {
        private readonly IHttpContextAccessor _http;

        public UserScopeHandler(IHttpContextAccessor http) => _http = http;

        protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken ct) {
            var ctx = _http.HttpContext;

            var userId =
                ctx?.User?.FindFirst("usuario_id")?.Value ??
                ctx?.User?.FindFirst("sub")?.Value ??
                (ctx?.Items.TryGetValue("UsuarioId", out var v) == true ? v?.ToString() : null) ??
                "anonimo";

            var userLogin =
                ctx?.User?.FindFirst("usuario_login")?.Value ??
                ctx?.User?.Identity?.Name ??
                (ctx?.Items.TryGetValue("UsuarioLogin", out var u) == true ? u?.ToString() : null) ??
                "anonimo";

            using (LogContext.PushProperty("UsuarioId", userId))
            using (LogContext.PushProperty("UsuarioLogin", userLogin)) {
                return await base.SendAsync(request, ct);
            }
        }
    }
}