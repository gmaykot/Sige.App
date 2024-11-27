using Microsoft.AspNetCore.Mvc;
using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Administrativo;
using SIGE.Services.Interfaces.Administrativo;
using Swashbuckle.AspNetCore.Annotations;

namespace SIGE.Controller.Administrativo
{
    [ApiController]
    [Route("menu-sistema")]
    public class MenuSistemaController(IMenuSistemaService service) : ControllerBase
    {
        IMenuSistemaService _menuSistemaService = service;

        [HttpPost()]
        [SwaggerOperation(Description = "Cadastro do menu ao sistema.")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> Incluir([FromBody] MenuSistemaDto menu) =>
            Ok(await _menuSistemaService.Incluir(menu));

        [HttpPut()]
        [SwaggerOperation(Description = "Altera as informações do menu do sistema.")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> Alterar([FromBody] MenuSistemaDto menu) =>
            Ok(await _menuSistemaService.Alterar(menu));

        [HttpDelete("{id}")]
        [SwaggerOperation(Description = "Exclui o menu do sistema.")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> Excluir([FromRoute] Guid Id) =>
            Ok(await _menuSistemaService.Excluir(Id));

        [HttpGet()]
        [SwaggerOperation(Description = "Obter os menus do sistema.")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> Obter() =>
           Ok(await _menuSistemaService.Obter());

        [HttpGet("estruturado")]
        [SwaggerOperation(Description = "Obter menus estrutuados do sistema.")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> ObterEstruturtado() =>
            Ok(await _menuSistemaService.ObterEstruturtado());

        [HttpGet("drop-down")]
        [SwaggerOperation(Description = "Obter menus para dropdown do sistema.")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> ObterDropDown() =>
            Ok(await _menuSistemaService.ObterDropDown());

        [HttpGet("drop-down-estruturado")]
        [SwaggerOperation(Description = "Obter menus para dropdown esrtuturado do sistema.")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> ObterDropDownEstruturado() =>
            Ok(await _menuSistemaService.ObterDropDownEstruturado());
    }
}
