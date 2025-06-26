using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Administrativo.Email;
using SIGE.Services.Interfaces.Externo;
using Swashbuckle.AspNetCore.Annotations;

namespace SIGE.Controller.Externo
{
    [ApiController]
    [Route("email")]
    public class EMailController(IEmailService service) : ControllerBase
    {
        private readonly IEmailService _service = service;

        [HttpPost()]
        [SwaggerOperation(Description = "Envia E-mail")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> SendEmail([FromBody] EmailDataDto req) =>
            Ok(await _service.SendEmail(req));

        [HttpGet("open/{id}")]
        [AllowAnonymous]
        [SwaggerOperation(Description = "Marca email como aberto")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> OpenEmail([FromRoute] Guid id)
        {
            _ = await _service.OpenEmail(id);
            var pixel = new byte[]
                {
                        71, 73, 70, 56, 57, 97, 1, 0,
                        1, 0, 128, 0, 0, 255, 255, 255,
                        0, 0, 0, 33, 249, 4, 1, 0,
                        0, 1, 0, 44, 0, 0, 0, 0,
                        1, 0, 1, 0, 0, 2, 2, 68,
                        1, 0, 59
                };
            return File(pixel, "image/gif");
        }

        [HttpGet()]
        [AllowAnonymous]
        [SwaggerOperation(Description = "Obtem Histórico")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> ObterHistorico() =>
            Ok(await _service.ObterHistorico());
    }
}
