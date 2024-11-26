using Microsoft.AspNetCore.Mvc;
using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Concessionaria;
using SIGE.Services.Interfaces;
using Swashbuckle.AspNetCore.Annotations;

namespace SIGE.Controller
{
    [ApiController]
    [Route("concessionaria")]
    public class ConcessioanriaController : ControllerBase
    {
        private readonly IBaseInterface<ConcessionariaDto> _concessionariaService;

        public ConcessioanriaController(IBaseInterface<ConcessionariaDto> concessionariaService) =>
            _concessionariaService = concessionariaService;

        [HttpPost()]
        [SwaggerOperation(Description = "Cadastro da empresa ao sistema.")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> Incluir([FromBody] ConcessionariaDto concessionaria) =>
                    Ok(await _concessionariaService.Incluir(concessionaria));

        [HttpPut()]
        [SwaggerOperation(Description = "Altera as informações da empresa ao sistema.")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> Alterar([FromBody] ConcessionariaDto concessionaria) =>
            Ok(await _concessionariaService.Alterar(concessionaria));

        [HttpDelete("{id}")]
        [SwaggerOperation(Description = "Exclui a empresa do sistema.")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> Excluir([FromRoute] Guid Id) =>
            Ok(await _concessionariaService.Excluir(Id));

        [HttpGet("{id}")]
        [SwaggerOperation(Description = "Obtém uma empresa com todos os dados.")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> Obter([FromRoute] Guid Id) =>
            Ok(await _concessionariaService.Obter(Id));

        [HttpGet()]
        [SwaggerOperation(Description = "Obtém a lista com todos os dados.")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> Obter() =>
            Ok(await _concessionariaService.Obter());

        [HttpGet("drop-down")]
        [SwaggerOperation(Description = "Obtém a lista com Id e Descrição")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> ObterDropDown() =>
            Ok(await _concessionariaService.ObterDropDown());
    }
}
