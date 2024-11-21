using Microsoft.AspNetCore.Mvc;
using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Empresa;
using SIGE.Services.Interfaces;
using Swashbuckle.AspNetCore.Annotations;

namespace SIGE.Controller
{
    [ApiController]
    [Route("empresa")]
    public class EmpresaController : ControllerBase
    {
        private readonly IEmpresaService _empresaService;

        public EmpresaController(IEmpresaService empresaService) =>
            _empresaService = empresaService;

        [HttpPost()]
        [SwaggerOperation(Description = "Cadastro da empresa ao sistema.")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> Incluir([FromBody] EmpresaDto empresa) =>
            Ok(await _empresaService.Incluir(empresa));

        [HttpPut()]
        [SwaggerOperation(Description = "Altera as informações da empresa ao sistema.")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> Alterar([FromBody] EmpresaDto empresa) =>
            Ok(await _empresaService.Alterar(empresa));
        
        [HttpDelete("{id}")]
        [SwaggerOperation(Description = "Exclui a empresa do sistema.")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> Excluir([FromRoute] Guid Id) =>
            Ok(await _empresaService.Excluir(Id));

        [HttpGet("{id}")]
        [SwaggerOperation(Description = "Obtém uma empresa com todos os dados.")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> Obter([FromRoute] Guid Id) =>
            Ok(await _empresaService.Obter(Id));

        [HttpGet()]
        [SwaggerOperation(Description = "Obtém a lista com todos os dados.")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> Obter() =>
            Ok(await _empresaService.Obter());

        [HttpGet("drop-down")]
        [SwaggerOperation(Description = "Obtém a lista apenas com os campos 'Id' e 'Descrição'")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> ObterDropDown() =>
            Ok(await _empresaService.ObterDropDown());
    }
}
