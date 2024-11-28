﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Requests;
using SIGE.Services.Interfaces;
using Swashbuckle.AspNetCore.Annotations;

namespace SIGE.Controller
{
    [ApiController]
    [Route("auth")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;  
       
        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }         

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

        [AllowAnonymous]
        [HttpPost("/setup")]
        [SwaggerOperation(Description = "Efetua o setup inicial do sistema.")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> Setup([FromBody] string password)
        {
            var res = await _authService.SetupSige(password);
            return Ok(res);
        }
    }

}