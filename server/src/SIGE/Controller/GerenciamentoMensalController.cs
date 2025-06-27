using Microsoft.AspNetCore.Mvc;
using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Gerencial.BandeiraTarifaria;
using SIGE.Core.Models.Dto.GerenciamentoMensal;
using SIGE.Services.Interfaces;
using Swashbuckle.AspNetCore.Annotations;

namespace SIGE.Controller
{
    [ApiController]
    [Route("gerenciamento-mensal")]
    public class GerenciamentoMensalController(IGerenciamentoMensalService service) : ControllerBase
    {
        public readonly IGerenciamentoMensalService _service = service;
        
        [HttpGet("{mesReferencia}")]
        [SwaggerOperation(Description = "Obter os dados de checklist")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> ObterChecklist(DateTime mesReferencia) =>
            Ok(await _service.ObterDadodsMensais(mesReferencia));

        [HttpPost("pis-cofins")]
        [SwaggerOperation(Description = "Inclui no sistema.")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> IncluirPisCofins([FromBody] PisCofinsMensalDto req) =>
            Ok(await _service.IncluirPisCofins(req));

        [HttpPost("bandeira")]
        [SwaggerOperation(Description = "Inclui no sistema.")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> IncluirBandeiraVigente([FromBody] BandeiraTarifariaVigenteDto req) =>
            Ok(await _service.IncluirBandeiraVigente(req));

        [HttpPost("proinfa-icms")]
        [SwaggerOperation(Description = "Inclui no sistema.")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> IncluirProinfaIcms([FromBody] ProinfaIcmsMensalDto req) =>
            Ok(await _service.IncluirProinfaIcms(req));

        [HttpPost("desconto-tusd")]
        [SwaggerOperation(Description = "Inclui no sistema.")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> IncluirDescontoTusd([FromBody] DescontoTUSDDto req) =>
            Ok(await _service.IncluirDescontoTusd(req));
    }
}