using Microsoft.AspNetCore.Mvc;
using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Medicao;
using SIGE.Services.Interfaces;
using Swashbuckle.AspNetCore.Annotations;

namespace SIGE.Controller
{
    [ApiController]
    [Route("medicao")]
    public class MedicaoController : ControllerBase
    {
        private readonly IMedicaoService _medicaoService;

        public MedicaoController(IMedicaoService medicaoService) =>
            _medicaoService = medicaoService;

        [HttpPost()]
        [SwaggerOperation(Description = "Obtém o cálculo da medição do relatório de economia")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> CalcularMedicao([FromBody] MedicaoDto req) =>
            Ok(await _medicaoService.CalcularMedicao(req));

        [HttpPost("valores")]
        [SwaggerOperation(Description = "Obtém o cálculo da medição do relatório de economia")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> IncluirValores([FromBody] MedicaoValoresDto req) =>
            Ok(await _medicaoService.IncluirValores(req));

        [HttpGet()]
        [SwaggerOperation(Description = "Obtém lista de medições para o relatório de economia")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> ListarMedicoes([FromQuery] MedicaoDto req) =>
            Ok(await _medicaoService.ListarMedicoes(req));

        [HttpPost("coletar")]
        [SwaggerOperation(Description = "Coleta as medições e salva na base de dados.")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> ColetarMedicoes([FromBody] ColetaMedicaoDto req) =>
            Ok(await _medicaoService.ColetarMedicoes(req));

        [HttpPost("resultado")]
        [SwaggerOperation(Description = "Obtem as medições salvas na base de dados.")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> ObterMedicoes([FromBody] MedicaoDto req) =>
            Ok(await _medicaoService.ObterMedicoes(req));


        [HttpGet("medicao-contrato")]
        [SwaggerOperation(Description = "Obtem as medições salvas na base de dados.")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> ObterMedicoes([FromQuery] Guid contratoId, DateTime competencia) =>
            Ok(await _medicaoService.ListaMedicoesPorContrato(contratoId, competencia));


        [HttpGet("agentes")]
        [SwaggerOperation(Description = "Obtém lista de agentes")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> ObterAgentes([FromQuery] Guid empresaId) =>
            Ok(await _medicaoService.ObterAgentes(empresaId));

        [HttpGet("pontos")]
        [SwaggerOperation(Description = "Obtém lista de pontos")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> ObterPontos([FromQuery] Guid agenteId) =>
            Ok(await _medicaoService.ObterPontos(agenteId));
    }
}
