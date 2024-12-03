using Microsoft.AspNetCore.Mvc;
using SIGE.Core.Models.Defaults;
using SIGE.Services.Interfaces.Administrativo;
using Swashbuckle.AspNetCore.Annotations;

namespace SIGE.Controller.Administrativo
{
    [ApiController]
    [Route("dashboard")]
    public class DashboardController(IDashboardService service) : ControllerBase
    {
        public readonly IDashboardService _service = service;

        [HttpGet("checklist/{mesReferencia}")]
        [SwaggerOperation(Description = "Obter os dados de checklist")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> ObterChecklist(DateTime mesReferencia) =>
            Ok(await _service.ObterChecklist(mesReferencia));

        [HttpGet("contratos-finalizados/{mesReferencia}")]
        [SwaggerOperation(Description = "Obter os dados de contratos finalizados")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> ObterContratosFinalizados(DateTime mesReferencia) =>
            Ok(await _service.ObterContratosFinalizados(mesReferencia));

        [HttpGet("status-medicoes/{mesReferencia}")]
        [SwaggerOperation(Description = "Obter os dados de status de coleta")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> ObterStatusMedicoes(DateTime mesReferencia) =>
            Ok(await _service.ObterStatusMedicoes(mesReferencia));

        [HttpGet("consumo-meses/{mesReferencia}/meses/{meses}")]
        [SwaggerOperation(Description = "Obter os dados consumo meses")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> ObterConsumoMeses(DateTime mesReferencia, int meses) =>
            Ok(await _service.ObterConsumoMeses(mesReferencia, meses));

    }
}
