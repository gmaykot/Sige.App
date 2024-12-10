using Microsoft.AspNetCore.Mvc;
using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Geral.Medicao;
using SIGE.Core.Models.Requests;
using Swashbuckle.AspNetCore.Annotations;

namespace SIGE.Controller.Geral
{
    [ApiController]
    [Route("coletar-medicoes")]
    public class ColetarMedicoesController : ControllerBase
    {
        #region Home Coletar Medições
        [HttpGet()]
        [SwaggerOperation(Description = "Obtém lista de medições para a home de coletar medições")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> ObterColetasEfetuadas([FromQuery] DateOnly mesReferencia) =>
            Ok(mesReferencia);

        [HttpPost()]
        [SwaggerOperation(Description = "Efetua a coleta das medições específicas ou gerais")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> ColetarMedicoes([FromBody] ColetarMedicoesRequest req) =>
            Ok(req);

        [HttpGet()]
        [SwaggerOperation(Description = "Obtém resultado do processamento de medições")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> ObterResultadoMedicao([FromQuery] DateOnly mesReferencia) =>
            Ok(mesReferencia);
        #endregion
    }
}