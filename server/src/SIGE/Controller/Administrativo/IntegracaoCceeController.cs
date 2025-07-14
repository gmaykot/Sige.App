using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SIGE.Core.Models.Dto.Administrativo.Ccee;
using SIGE.Services.Interfaces.Externo;

namespace SIGE.Controller.Administrativo {
    public class IntegracaoCceeController(IIntegracaoCceeService service) : ControllerBase {
        [AllowAnonymous]
        [HttpPost("resultado-relatorio-bsv2")]
        public async Task<IActionResult> ResultadoRelatorioBSv2([FromBody] IntegracaoCceeBaseDto req) {
            var response = await service.ResultadoRelatorioBSv2(req);
            return Ok(response);
        }
    }
}
