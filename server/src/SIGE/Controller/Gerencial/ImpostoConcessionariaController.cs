using Microsoft.AspNetCore.Mvc;
using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Gerencial.Concessionaria;
using SIGE.Core.Models.Sistema.Gerencial.Concessionaria;
using SIGE.Services.Interfaces;
using Swashbuckle.AspNetCore.Annotations;

namespace SIGE.Controller.Gerencial
{
    [Route("imposto-concessionaria")]
    public class ImpostoConcessionariaController(IBaseInterface<ImpostoConcessionariaDto, ImpostoConcessionariaModel> service) : BaseController<ImpostoConcessionariaDto, ImpostoConcessionariaModel>(service)
    {

        [HttpGet("concessionaria/{id}")]
        [SwaggerOperation(Description = "Obtém filtrado com todos os dados.")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> ObterPorConcessionaria([FromRoute] Guid Id)
        {
            var response = await _service.Obter(
                filtro: b => b.Concessionaria.Id == Id,
                orderBy: q => q.OrderByDescending(x => x.MesReferencia));

            return Ok(response);
        }
    }
}
