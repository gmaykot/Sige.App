﻿using Microsoft.AspNetCore.Mvc;
using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Gerencial.Concessionaria;
using SIGE.Services.Interfaces.Gerencial;
using Swashbuckle.AspNetCore.Annotations;

namespace SIGE.Controller.Gerencial
{
    [ApiController]
    [Route("imposto-concessionaria")]
    public class ImpostoConcessionariaController(IImpostoConcessionariaService service) : ControllerBase
    {
        private readonly IImpostoConcessionariaService _service = service;

        [HttpPost()]
        [SwaggerOperation(Description = "Inclui no sistema.")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> Incluir([FromBody] ImpostoConcessionariaDto req) =>
            Ok(await _service.Incluir(req));

        [HttpPut()]
        [SwaggerOperation(Description = "Altera os dados no sistema.")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> Alterar([FromBody] ImpostoConcessionariaDto req) =>
            Ok(await _service.Alterar(req));

        [HttpDelete("{id}")]
        [SwaggerOperation(Description = "Exclui os dados do sistema.")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> Excluir([FromRoute] Guid Id) =>
            Ok(await _service.Excluir(Id));

        [HttpGet("{id}")]
        [SwaggerOperation(Description = "Obtém um com todos os dados.")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> Obter([FromRoute] Guid Id) =>
            Ok(await _service.Obter(Id));

        [HttpGet()]
        [SwaggerOperation(Description = "Obtém a lista com todos os dados.")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> Obter() =>
            Ok(await _service.Obter());

        [HttpGet("concessionaria/{id}")]
        [SwaggerOperation(Description = "Obtém filtrado com todos os dados.")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> ObterPorConcessionaria([FromRoute] Guid Id) =>
            Ok(await _service.ObterPorConcessionaria(Id));
    }
}
