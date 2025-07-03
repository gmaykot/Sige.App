using Microsoft.AspNetCore.Mvc;
using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Gerencial.Concessionaria;
using SIGE.Core.Models.Sistema.Gerencial.Concessionaria;
using SIGE.Services.Interfaces.Gerencial;
using Swashbuckle.AspNetCore.Annotations;

namespace SIGE.Controller.Gerencial
{
    [Route("concessionaria")]
    public class ConcessionariaController(IConcessionariaService service) : BaseController<ConcessionariaDto, ConcessionariaModel>(service)
    {
        [HttpGet("pontoMedicao/{id}")]
        [SwaggerOperation(Description = "Obtém uma empresa com todos os dados.")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> ObterPorPontoMedicao([FromRoute] Guid Id)
        {
            var response = await service.ObterPorPontoMedicao(Id);

            return Ok(response);
        }
    }
}
