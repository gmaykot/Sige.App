using Microsoft.AspNetCore.Mvc;
using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Geral.RelatorioEconomia;
using SIGE.Core.Models.Sistema.Geral.Economia;
using SIGE.Services.Interfaces.Gerencial;
using Swashbuckle.AspNetCore.Annotations;

namespace SIGE.Controller.Gerencial
{
    [Route("energia-acumulada")]
    public class EnergiaAcumuladaController(IEnergiaAcumuladaService service) : BaseController<EnergiaAcumuladaDto, EnergiaAcumuladaModel>(service)
    {
        [HttpPost()]
        [SwaggerOperation(Description = "Inclui no sistema.")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public override async Task<IActionResult> Incluir([FromBody] EnergiaAcumuladaDto req) =>
            Ok(await service.Incluir(req));

        [HttpPut()]
        [SwaggerOperation(Description = "Altera os dados no sistema.")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public override async Task<IActionResult> Alterar([FromBody] EnergiaAcumuladaDto req) =>
            Ok(await service.Alterar(req));

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
                c => c.PontoMedicao);

            return Ok(response);
        }
    }
}
