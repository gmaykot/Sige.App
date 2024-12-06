using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Requests;
using SIGE.Services.Interfaces.Administrativo;
using Swashbuckle.AspNetCore.Annotations;

namespace SIGE.Controller.Administrativo
{
    [ApiController]
    [Route("oauth2")]
    public class OAuth2Controller(IOAuth2Service service) : ControllerBase
    {
        private readonly IOAuth2Service _service = service;

        [AllowAnonymous]
        [HttpGet("hc")]
        [SwaggerOperation(Description = "HealthCheck.")]
        [ProducesResponseType(typeof(Response), 200)]
        public IActionResult GetHealthCheck() => Ok("");

        [AllowAnonymous]
        [HttpPost("login")]
        [SwaggerOperation(Description = "Efetua o login do usuario.")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> Login([FromBody] LoginRequest req)
        {
            return Ok(await _service.Login(req));
        }

        [HttpPost("logout")]
        [SwaggerOperation(Description = "Efetua o logout do usuario.")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> Logout()
        {
            return Ok(await _service.Logout());
        }

        [HttpPost("introspect")]
        [SwaggerOperation(Description = "Efetua o introspect do token.")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> Introspect([FromForm] Guid token)
        {
            return Ok(await _service.Introspect(token));
        }
    }
}
