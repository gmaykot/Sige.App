using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Geral.RelatorioEconomia;
using SIGE.Core.Models.Sistema.Geral.Economia;
using SIGE.Services.Interfaces;
using Swashbuckle.AspNetCore.Annotations;

namespace SIGE.Controller.Gerencial
{
    [Route("energia-acumulada")]
    public class EnergiaAcumuladaController(IBaseInterface<EnergiaAcumuladaDto, EnergiaAcumuladaModel> service) : BaseController<EnergiaAcumuladaDto, EnergiaAcumuladaModel>(service)
    {
        [HttpGet("pontoMedicao/{id}")]
        [SwaggerOperation(Description = "Obtém um com todos os dados.")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> ObterPorPontoMedicao([FromRoute] Guid Id)
        {
            var response = await _service.Obter(
                filtro: b => b.PontoMedicaoId == Id,
                orderBy: q => q.OrderByDescending(x => x.MesReferencia));

            return Ok(response);
        }

        [HttpGet("mesReferencia/{mesReferencia?}")]
        [SwaggerOperation(Description = "Obtém um com todos os dados.")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> ObterPorMesReferencia([FromRoute] DateTime? MesReferencia)
        {
            var response = await _service.Obter(
                filtro: MesReferencia != null ? (x => x.MesReferencia == MesReferencia) : null,
                orderBy: q => q.OrderByDescending(x => x.MesReferencia),
                include: i => i.Include(p => p.PontoMedicao));

            return Ok(response);
        }
    }
}
