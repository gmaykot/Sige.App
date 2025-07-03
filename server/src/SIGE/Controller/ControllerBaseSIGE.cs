using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using SIGE.Core.Models.Defaults;
using SIGE.Services.Interfaces;

namespace SIGE.Controller
{
    [ApiController]
    [Route("[controller]")]
    public abstract class BaseController<T, M>(IBaseInterface<T, M> service) : ControllerBase
    {
        protected readonly IBaseInterface<T, M> _service = service;

        [HttpPost]
        [SwaggerOperation(Description = "Inclui no sistema.")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public virtual async Task<IActionResult> Incluir([FromBody] T req)
        {
            var response = await _service.Incluir(req);
            return Ok(response);
        }

        [HttpPut]
        [SwaggerOperation(Description = "Altera os dados no sistema.")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public virtual async Task<IActionResult> Alterar([FromBody] T req)
        {
            var response = await _service.Alterar(req);
            return Ok(response);
        }

        [HttpDelete("{id}")]
        [SwaggerOperation(Description = "Exclui os dados do sistema.")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public virtual async Task<IActionResult> Excluir([FromRoute] Guid id)
        {
            var response = await _service.Excluir(id);
            return Ok(response);
        }

        [HttpGet("{id}")]
        [SwaggerOperation(Description = "Obtém um registro pelo ID.")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public virtual async Task<IActionResult> Obter([FromRoute] Guid id)
        {
            var response = await _service.Obter(id);
            return Ok(response);
        }

        [HttpGet]
        [SwaggerOperation(Description = "Obtém a lista com todos os registros.")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public virtual async Task<IActionResult> Obter()
        {
            var response = await _service.Obter();
            return Ok(response);
        }

        [HttpGet("drop-down")]
        [SwaggerOperation(Description = "Obtém a lista com Id e Descrição")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> ObterDropDown()
        {
            var response = await _service.ObterDropDown();
            return Ok(response);
        }            
    }
}
