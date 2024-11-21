using Microsoft.AspNetCore.Http;
using Microsoft.IdentityModel.Tokens;

namespace SIGE.Core.Extensions
{
    public static class HttpContextAccessorExtensions
    {
        public static string GetHeaderValue(this IHttpContextAccessor httpContextAccessor, string header)
        {
            httpContextAccessor.HttpContext?.Request.Headers.TryGetValue(header, out var bearerHeader);
            return bearerHeader.ToString();
        }

        public static Guid GetGestorId(this IHttpContextAccessor httpContextAccessor)
        {
            var gestorId = httpContextAccessor.GetHeaderValue("gestor_id");
            if (gestorId.IsNullOrEmpty())
                return Guid.Empty;

            return new Guid(gestorId);
        }

        public static string GetUser(this IHttpContextAccessor httpContextAccessor) =>
            httpContextAccessor.GetHeaderValue("name");
    }
}
