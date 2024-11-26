using Microsoft.AspNetCore.Mvc;
using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Concessionaria;
using SIGE.Services.Interfaces;
using Swashbuckle.AspNetCore.Annotations;

namespace SIGE.Controller
{
    [ApiController]
    public class GerencialController(IAnaliseViabilidadeService analiseViabilidadeService, IRelatorioEconomiaService relatorioEconomiaService) : ControllerBase
    {
        private readonly IAnaliseViabilidadeService _analiseViabilidadeService = analiseViabilidadeService;

        [HttpPost("analise-viabilidade")]
        [SwaggerOperation(Description = "Obtém o cálculo da análise de viabilidade.")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> CalcularAnalise([FromBody] AnaliseViabilidadeDto req) =>
            Ok(await _analiseViabilidadeService.CalcularAnalise(req));
    }
}
