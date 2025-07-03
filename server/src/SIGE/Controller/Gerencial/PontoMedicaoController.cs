using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Default;
using SIGE.Core.Models.Dto.Gerencial.Empresa;
using SIGE.Core.Models.Sistema.Gerencial.Empresa;
using SIGE.Services.Interfaces.Gerencial;
using Swashbuckle.AspNetCore.Annotations;

namespace SIGE.Controller.Gerencial
{
    [Route("ponto-medicao")]
    public class PontoMedicaoController(IPontoMedicaoService service) : BaseController<PontoMedicaoDto, PontoMedicaoModel>(service)
    {

        [HttpGet("drop-down/empresa/{id}")]
        [SwaggerOperation(Description = "Obtém dropdown filtrado.")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> ObterDropDown(Guid Id)
        {
            var response = await _service.Obter<DropDownDto>(
                filtro: b => b.AgenteMedicao.EmpresaId == Id,
                orderBy: o => o.OrderBy(a => a.Nome),
                include: i => i.Include(c => c.AgenteMedicao));

            return Ok(response);
        }

        [HttpGet("drop-down/segmento")]
        [SwaggerOperation(Description = "Obtém dropdown filtrado.")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> ObterDropDownComSegmento() =>
            Ok(await service.ObterDropDownComSegmento());
    }
}
