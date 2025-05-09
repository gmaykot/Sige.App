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

        [HttpGet("final")]
        [SwaggerOperation(Description = "Obtém o cálculo do relatório final de economia.")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> ObterFinal([FromQuery] Guid contratoId, [FromQuery] DateTime mesReferencia) =>
            Ok(await _service.ObterFinal(contratoId, mesReferencia));
    }
}
