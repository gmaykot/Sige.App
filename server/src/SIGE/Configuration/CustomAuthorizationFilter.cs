using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using SIGE.Core.Models.Defaults;
using SIGE.Core.Options;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Text;

namespace SIGE.Configuration
{
    public class CustomAuthorizationFilter(IWebHostEnvironment environment, IConfiguration config, IOptions<SystemOption> option) : IAsyncAuthorizationFilter
    {
        private readonly IWebHostEnvironment _environment = environment;
        private readonly IConfiguration _config = config;
        private readonly SystemOption _option = option.Value;

        public void SetAuthorizationBody<T>(AuthorizationFilterContext filterContext, HttpStatusCode httpStatus, string message = "", string erroMessage = "") {
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

        public async Task OnAuthorizationAsync(AuthorizationFilterContext filterContext)
        {
            ArgumentNullException.ThrowIfNull(filterContext);
                
            if (filterContext.HttpContext?.GetEndpoint() == null)
                return;

            if (filterContext.ActionDescriptor.EndpointMetadata
                    .Any(em => em.GetType() == typeof(AllowAnonymousAttribute)))
                return;
            

            if (!filterContext.HttpContext.Request.Headers.ContainsKey("Authorization") && !_environment.IsStaging())
            {
                SetAuthorizationBody<BadRequestObjectResult>(filterContext, HttpStatusCode.BadRequest, string.Empty, "Token inexistente na requisição.");
                return;
            }

            if (!IsValidJwtToken(filterContext.HttpContext, out var token) && !_environment.IsStaging())
            {
                SetAuthorizationBody<UnauthorizedObjectResult>(filterContext, HttpStatusCode.Unauthorized, string.Empty, "O token fornecido é inválido.");
                return;
            }

            if (token.Payload.TryGetValue("name", out var y) && y is string name)
                filterContext.HttpContext.Request.Headers.Add("name", name);

            await Task.CompletedTask;
        }

        public bool IsValidJwtToken(HttpContext context, out JwtSecurityToken token)
        {
            var jwtString = context.Request.Headers.Authorization.ToString().Split(" ").Last();
            if (jwtString.IsNullOrEmpty())
            {
                token = new JwtSecurityToken();
                return false;
            }                

            var handler = new JwtSecurityTokenHandler();
            var isValid = handler.CanReadToken(jwtString);
            try
            {
                handler.ValidateToken(jwtString, GetValidationParameters(), out var validatedToken);
                if (validatedToken is JwtSecurityToken jwtSecurityToken)
                    isValid = jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256Signature, StringComparison.InvariantCultureIgnoreCase);
            }
            catch
            {
                isValid = false;
            }
            var securityToken = handler.ReadJwtToken(jwtString);
            token = isValid ? securityToken : new JwtSecurityToken();
            return isValid;
        }

        private TokenValidationParameters GetValidationParameters()
        {
            return new TokenValidationParameters()
            {
                ValidateLifetime = false,
                ValidateAudience = false,
                ValidateIssuer = false,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_option.JwtSecurityToken))
            };
        }
    }
}
