using Microsoft.AspNetCore.Mvc;
using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Gerencial.Concessionaria;
using SIGE.Services.Interfaces;
using Swashbuckle.AspNetCore.Annotations;

namespace SIGE.Controller.Gerencial
{
    [ApiController]
    [Route("valor-concessionaria")]
    public class ValorConcessionariaController(IBaseInterface<ValorConcessionariaDto> valorConcessionariaService) : ControllerBase
    {
        private readonly IBaseInterface<ValorConcessionariaDto> _valorConcessionariaService = valorConcessionariaService;

        [HttpPost()]
        [SwaggerOperation(Description = "Cadastro da valores ao sistema.")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> Incluir([FromBody] ValorConcessionariaDto valorConcessionaria) =>
            Ok(await _valorConcessionariaService.Incluir(valorConcessionaria));

        [HttpPut()]
        [SwaggerOperation(Description = "Alteração de valores ao sistema.")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> Alterar([FromBody] ValorConcessionariaDto valorConcessionaria) =>
            Ok(await _valorConcessionariaService.Alterar(valorConcessionaria));

        [HttpGet()]
        [SwaggerOperation(Description = "Obtém a lista com todos os dados.")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> Obter() =>
            Ok(await _valorConcessionariaService.Obter());

        [HttpDelete("{id}")]
        [SwaggerOperation(Description = "Exclui os valores do sistema.")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> Excluir([FromRoute] Guid Id) =>
    Ok(await _valorConcessionariaService.Excluir(Id));
    }
}
