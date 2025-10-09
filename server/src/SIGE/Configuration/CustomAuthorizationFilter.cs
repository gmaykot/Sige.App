using System.Net;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.IdentityModel.Tokens;
using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Requests;
using SIGE.Services.Interfaces.Administrativo;

namespace SIGE.Configuration {

    public class CustomAuthorizationFilter(RequestContext requestContext, IOAuth2Service service)
        : IAsyncAuthorizationFilter {
        private readonly RequestContext _requestContext = requestContext;
        private readonly IOAuth2Service _service = service;

        public void SetAuthorizationBody<T>(
            AuthorizationFilterContext filterContext,
            HttpStatusCode httpStatus,
            string message = "",
            string erroMessage = ""
        ) {
            filterContext.HttpContext.Response.StatusCode = httpStatus.GetHashCode();
            filterContext.HttpContext.Response.ContentType = "application/json";
            var body = new Response(httpStatus, message);
            if (!erroMessage.IsNullOrEmpty())
                body.AddError("Authorization", erroMessage);

            if (typeof(T).IsAssignableFrom(typeof(UnauthorizedObjectResult)))
                filterContext.Result = new UnauthorizedObjectResult(body);
            if (typeof(T).IsAssignableFrom(typeof(BadRequestObjectResult)))
                filterContext.Result = new BadRequestObjectResult(body);
        }

        public async Task OnAuthorizationAsync(AuthorizationFilterContext filterContext) {
            ArgumentNullException.ThrowIfNull(filterContext);

            if (filterContext.HttpContext?.GetEndpoint() == null)
                return;

            if (
                filterContext.ActionDescriptor.EndpointMetadata.Any(em =>
                    em.GetType() == typeof(AllowAnonymousAttribute)
                )
            )
                return;

            if (!filterContext.HttpContext.Request.Headers.ContainsKey("Authorization")) {
                SetAuthorizationBody<BadRequestObjectResult>(
                    filterContext,
                    HttpStatusCode.BadRequest,
                    string.Empty,
                    "Token inexistente na requisição."
                );
                return;
            }

            if (!ExtractToken(filterContext.HttpContext, out var token)) {
                SetAuthorizationBody<UnauthorizedObjectResult>(
                    filterContext,
                    HttpStatusCode.Unauthorized,
                    string.Empty,
                    "O token fornecido é inválido."
                );
                return;
            }

            var introspect = await _service.Introspect(token);
            if (introspect == null || !introspect.Ativo) {
                SetAuthorizationBody<UnauthorizedObjectResult>(
                    filterContext,
                    HttpStatusCode.Unauthorized,
                    string.Empty,
                    "O token fornecido é inválido."
                );
                return;
            }

            _requestContext.UsuarioId = introspect.UsuarioId;
            _requestContext.Usuario = introspect.Usuario;

            if (filterContext.HttpContext?.Items != null) {
                filterContext.HttpContext.Items["UsuarioId"] = introspect.UsuarioId;
                filterContext.HttpContext.Items["UsuarioLogin"] = introspect.Usuario;
            }

            _requestContext.Authorization = token;

            await Task.CompletedTask;
        }

        public bool ExtractToken(HttpContext context, out Guid result) {
            var token = context.Request.Headers.Authorization.ToString().Split(" ").Last();
            result = Guid.Empty;

            if (token.IsNullOrEmpty())
                return false;

            if (!Guid.TryParse(token, out var tokenId))
                return false;

            result = tokenId;
            return true;
        }
    }
}