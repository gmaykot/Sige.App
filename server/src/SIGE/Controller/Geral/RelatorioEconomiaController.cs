using Microsoft.AspNetCore.Mvc;
using SIGE.Core.Models.Defaults;
using SIGE.Services.Interfaces.Geral;
using Swashbuckle.AspNetCore.Annotations;

namespace SIGE.Controller.Geral
{
    [ApiController]
    [Route("relatorio-economia")]
    public class RelatorioEconomiaController(IRelatorioEconomiaService service) : ControllerBase
    {
        private readonly IRelatorioEconomiaService _service = service;

        [HttpGet("{mesReferencia}")]
        [SwaggerOperation(Description = "Obtém o cálculo do relatório de economia.")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> ListarRelatorios([FromRoute] DateOnly? mesReferencia) =>
            Ok(await _service.ListarRelatorios(mesReferencia));

        [HttpGet("final/{pontoMedicaoId}/{mesReferencia}")]
        [SwaggerOperation(Description = "Obtém o cálculo do relatório final de economia.")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> ObterFinal([FromRoute] Guid pontoMedicaoId, [FromRoute] DateOnly mesReferencia) =>
            Ok(await _service.ObterFinal(pontoMedicaoId, mesReferencia));
        
        [HttpGet("final/{pontoMedicaoId}/{mesReferencia}/pdf")]
        [SwaggerOperation(Description = "Obtém o cálculo do relatório final de economia.")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> ObterFinalPdf([FromRoute] Guid pontoMedicaoId, [FromRoute] DateOnly mesReferencia) =>
            Ok(await _service.ObterFinalPdf(pontoMedicaoId, mesReferencia));
    }
}
