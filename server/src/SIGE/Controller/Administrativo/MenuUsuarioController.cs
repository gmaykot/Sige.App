﻿using Microsoft.AspNetCore.Mvc;
using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Administrativo;
using SIGE.Services.Interfaces.Administrativo;
using Swashbuckle.AspNetCore.Annotations;

namespace SIGE.Controller.Administrativo
{
    [ApiController]
    [Route("menu-usuario")]
    public class MenuUsuarioController(IMenuUsuarioService service) : ControllerBase
    {
        private readonly IMenuUsuarioService _service = service;

        [HttpPost()]
        [SwaggerOperation(Description = "Inclui no sistema.")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> Incluir([FromBody] MenuUsuarioDto req) =>
            Ok(await _service.Incluir(req));

        [HttpPost("menus")]
        [SwaggerOperation(Description = "Inclui no sistema.")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> IncluirMenus([FromBody] MenuUsuarioDto[] req) =>
            Ok(await _service.IncluirMenus(req));

        [HttpPut()]
        [SwaggerOperation(Description = "Altera no sistema.")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> Alterar([FromBody] MenuUsuarioDto req) =>
            Ok(await _service.Alterar(req));

        [HttpDelete("{id}")]
        [SwaggerOperation(Description = "Exclui no sistema.")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> Excluir([FromRoute] Guid Id) =>
            Ok(await _service.Excluir(Id));

        [HttpGet("{id}")]
        [SwaggerOperation(Description = "Obtém por id.")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> Obter([FromRoute] Guid Id) =>
            Ok(await _service.Obter(Id));

        [HttpGet("usuario/{id}")]
        [SwaggerOperation(Description = "Obtém por id.")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> ObterPorUsuario([FromRoute] Guid Id) =>
            Ok(await _service.ObterPorUsuario(Id));

        [HttpGet("drop-down")]
        [SwaggerOperation(Description = "Obtém a lista apenas com os campos 'Id' e 'Descrição'")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> ObterDropDown() =>
            Ok(await _service.ObterDropDown());
    }
}
