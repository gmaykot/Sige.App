using Microsoft.AspNetCore.Mvc;
using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Gerencial;
using SIGE.Core.Models.Sistema.Gerencial;
using SIGE.Services.Interfaces;
using Swashbuckle.AspNetCore.Annotations;

namespace SIGE.Controller.Gerencial
{

    [Route("contato")]
    public class ContatoController(IBaseInterface<ContatoDto, ContatoModel> service) : BaseController<ContatoDto, ContatoModel>(service)
    {
        [HttpGet("fornecedor/{id}")]
        [SwaggerOperation(Description = "Obtém um com todos os dados.")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> ObterPorFornecedor([FromRoute] Guid Id)
        {
            var response = await _service.Obter(
                filtro: c => c.FornecedorId == Id && c.RecebeEmail,
                orderBy: q => q.OrderBy(c => c.Nome));

            return Ok(response);
        }
    }
}
