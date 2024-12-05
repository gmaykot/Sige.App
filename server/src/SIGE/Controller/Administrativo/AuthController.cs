﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SIGE.Core.Cache;
using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Requests;
using SIGE.Services.Interfaces.Administrativo;
using Swashbuckle.AspNetCore.Annotations;

namespace SIGE.Controller.Administrativo
{
    [ApiController]
    [Route("auth")]
    public class AuthController(IAuthService authService, ICacheManager cacheManager) : ControllerBase
    {
        private readonly IAuthService _authService = authService;
        private readonly ICacheManager _cacheManager = cacheManager;

        [AllowAnonymous]
        [HttpGet("hc")]
        [SwaggerOperation(Description = "HealthCheck.")]
        [ProducesResponseType(typeof(Response), 200)]
        public IActionResult GetHealthCheck() => Ok("");

        [AllowAnonymous]
        [HttpPost("login")]
        [SwaggerOperation(Description = "Efetua o login do usuário ao sistema.")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> Login([FromBody] LoginRequest login)
        {
            var res = await _authService.Login(login);
            return Ok(res);
        }

        [HttpPost("clear-cache")]
        [SwaggerOperation(Description = "Efetua a limpeza do cache no sistema.")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> ClearCache([FromBody] string? key)
        {
            if (string.IsNullOrWhiteSpace(key))
                await _cacheManager.ClearAll();
            else
                await _cacheManager.Remove(key);

            return Ok();
        }

        [HttpGet("list-cache")]
        [SwaggerOperation(Description = "Obtém as chaves do cache no sistema.")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> ListAllKeys()
        {
            return Ok(await _cacheManager.ListAllKeys());
        }
    }

}
