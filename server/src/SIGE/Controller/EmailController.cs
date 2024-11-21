using Microsoft.AspNetCore.Mvc;
using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Mail;
using SIGE.Services.Interfaces;
using Swashbuckle.AspNetCore.Annotations;

namespace SIGE.Controller
{
    [ApiController]
    [Route("email")]
    public class EMailController : ControllerBase
    {
        private readonly IEmailService _service;

        public EMailController(IEmailService service) =>
            _service = service;

        [HttpPost()]
        [SwaggerOperation(Description = "Envia E-mail")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> SendEmail([FromBody] EmailDataDto req) =>
            Ok(await _service.SendEmail(req));
    }
}
