using Microsoft.AspNetCore.Mvc;
using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Gerencial.Contrato;
using SIGE.Services.Interfaces.Gerencial;
using Swashbuckle.AspNetCore.Annotations;

namespace SIGE.Controller.Gerencial
{
    [ApiController]
    [Route("contrato")]
    public class ContratoController(IContratoService contratoService) : ControllerBase
    {
        private readonly IContratoService _contratoService = contratoService;

        [HttpPost()]
        [SwaggerOperation(Description = "Efetua a inclusão de um contrato sistema.")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> Incluir([FromBody] ContratoDto req) =>
            Ok(await _contratoService.Incluir(req));

        [HttpPost("empresa-grupo")]
        [SwaggerOperation(Description = "Efetua a inclusão de uma empresa no grupo de contrato.")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> IncluirEmpresaGrupo([FromBody] ContratoEmpresaDto req) =>
            Ok(await _contratoService.IncluirEmpresaGrupo(req));

        [HttpDelete("empresa-grupo/{id}")]
        [SwaggerOperation(Description = "Efetua a remoção de uma empresa no grupo de contrato.")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> ExcluirEmpresaGrupo([FromRoute] Guid id) =>
            Ok(await _contratoService.ExcluirEmpresaGrupo(id));

        [HttpPut()]
        [SwaggerOperation(Description = "Efetua a inclusão de um contrato sistema.")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> Alterar([FromBody] ContratoDto req) =>
            Ok(await _contratoService.Alterar(req));

        [HttpGet("{id}")]
        [SwaggerOperation(Description = "Obtém um contrato com todos os dados.")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> Obter([FromRoute] Guid Id) =>
            Ok(await _contratoService.Obter(Id));

        [HttpDelete("{id}")]
        [SwaggerOperation(Description = "Exclui o contrato do sistema.")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> Excluir([FromRoute] Guid Id) =>
            Ok(await _contratoService.Excluir(Id));

        [HttpGet()]
        [SwaggerOperation(Description = "Obtém a lista com todos os dados.")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> Obter() =>
            Ok(await _contratoService.Obter());

        [HttpGet("drop-down")]
        [SwaggerOperation(Description = "Obtém a lista apenas com os campos 'Id' e 'Descrição'")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> ObterDropDown() =>
            Ok(await _contratoService.ObterDropDown());
    }
}
