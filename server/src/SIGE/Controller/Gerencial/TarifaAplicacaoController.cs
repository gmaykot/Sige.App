﻿using Microsoft.AspNetCore.Mvc;
using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Gerencial;
using SIGE.Services.Interfaces;
using Swashbuckle.AspNetCore.Annotations;

namespace SIGE.Controller.Gerencial
{
    [ApiController]
    [Route("tarifa-aplicacao")]
    public class TarifaAplicacaoController(IBaseInterface<TarifaAplicacaoDto> service) : ControllerBase
    {
        private readonly IBaseInterface<TarifaAplicacaoDto> _service = service;

        [HttpPost()]
        [SwaggerOperation(Description = "Inclui no sistema.")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> Incluir([FromBody] TarifaAplicacaoDto req) =>
            Ok(await _service.Incluir(req));

        [HttpPut()]
        [SwaggerOperation(Description = "Altera os dados no sistema.")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> Alterar([FromBody] TarifaAplicacaoDto req) =>
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
    }
}
