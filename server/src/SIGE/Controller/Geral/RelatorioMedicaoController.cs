using Microsoft.AspNetCore.Mvc;
using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Geral.RelatorioMedicao;
using SIGE.Core.Models.Requests;
using SIGE.Services.Interfaces.Geral;
using Swashbuckle.AspNetCore.Annotations;

namespace SIGE.Controller.Geral
{
    [ApiController]
    [Route("relatorio-medicao")]
    public class RelatorioMedicaoController(IRelatorioMedicaoService service) : ControllerBase
    {
        private readonly IRelatorioMedicaoService _service = service;

        [HttpPost]
        [SwaggerOperation(Description = "Obtém o cálculo do relatório de economia.")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> ListarRelatorios([FromBody] RelatorioMedicaoRequest req) =>
            Ok(await _service.ListarRelatorios(req));

        [HttpGet()]
        [SwaggerOperation(Description = "Obtém o cálculo do relatório de economia.")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> Obter([FromQuery] Guid contratoId, [FromQuery] DateTime competencia) =>
            Ok(await _service.Obter(contratoId, competencia));

        [HttpGet("final")]
        [SwaggerOperation(Description = "Obtém o cálculo do relatório final de economia.")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> ObterFinal([FromQuery] Guid contratoId, [FromQuery] DateTime competencia) =>
            Ok(await _service.ObterFinal(contratoId, competencia));

        [HttpPut()]
        [SwaggerOperation(Description = "Altera os dados no sistema.")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> Alterar([FromBody] RelatorioMedicaoDto req) =>
            Ok(await _service.Alterar(req));
    }
}
