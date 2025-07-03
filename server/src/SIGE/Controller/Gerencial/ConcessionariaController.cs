using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Default;
using SIGE.Core.Models.Dto.Gerencial.Concessionaria;
using SIGE.Core.Models.Sistema.Gerencial.Concessionaria;
using SIGE.Services.Interfaces;
using Swashbuckle.AspNetCore.Annotations;

namespace SIGE.Controller.Gerencial
{
    [Route("concessionaria")]
    public class ConcessionariaController(IBaseInterface<ConcessionariaDto, ConcessionariaModel> service) : BaseController<ConcessionariaDto, ConcessionariaModel>(service)
    {
        [HttpGet("pontoMedicao/{id}")]
        [SwaggerOperation(Description = "Obtém uma empresa com todos os dados.")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> ObterPorPontoMedicao([FromRoute] Guid Id)
        {
            var response = await _service.Obter<DropDownDto>(
                filtro: b => b.PontosMedicao.Any(p => p.Id == Id),
                orderBy: o => o.OrderBy(c => c.Nome),
                include: i => i.Include(c => c.PontosMedicao));

            return Ok(response);
        }
    }
}
