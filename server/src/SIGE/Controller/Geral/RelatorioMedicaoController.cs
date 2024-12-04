using Microsoft.AspNetCore.Mvc;
using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Requests;
using SIGE.Services.Interfaces.Geral;
using Swashbuckle.AspNetCore.Annotations;

namespace SIGE.Controller.Geral
{
    [ApiController]
    [Route("relatorio-medicao")]
    public class RelatorioMedicaoController(IRelatorioMedicaoService relatorioEconomiaService) : ControllerBase
    {
        private readonly IRelatorioMedicaoService _relatorioEconomiaService = relatorioEconomiaService;

        [HttpPost]
        [SwaggerOperation(Description = "Obtém o cálculo do relatório de economia.")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> ListarRelatorios([FromBody] RelatorioMedicaoRequest req) =>
            Ok(await _relatorioEconomiaService.ListarRelatorios(req));

        [HttpGet()]
        [SwaggerOperation(Description = "Obtém o cálculo do relatório de economia.")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> Obter([FromQuery] Guid contratoId, [FromQuery] DateTime competencia) =>
            Ok(await _relatorioEconomiaService.Obter(contratoId, competencia));

        [HttpGet("final")]
        [SwaggerOperation(Description = "Obtém o cálculo do relatório final de economia.")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> ObterFinal([FromQuery] Guid contratoId, [FromQuery] DateTime competencia) =>
    Ok(await _relatorioEconomiaService.ObterFinal(contratoId, competencia));
    }
}
