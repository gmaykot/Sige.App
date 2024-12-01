using Microsoft.AspNetCore.Mvc;
using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Gerencial;
using SIGE.Services.Interfaces;
using Swashbuckle.AspNetCore.Annotations;

namespace SIGE.Controller.Gerencial
{
    [ApiController]
    [Route("fornecedor")]
    public class FornecedorController(IBaseInterface<FornecedorDto> fornecedorService) : ControllerBase
    {
        private readonly IBaseInterface<FornecedorDto> _fornecedorService = fornecedorService;

        [HttpPost()]
        [SwaggerOperation(Description = "Cadastro do fornecedor ao sistema.")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> Incluir([FromBody] FornecedorDto fornecedor) =>
            Ok(await _fornecedorService.Incluir(fornecedor));

        [HttpPut()]
        [SwaggerOperation(Description = "Altera as informações do fornecedor ao sistema.")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> Alterar([FromBody] FornecedorDto fornecedor) =>
            Ok(await _fornecedorService.Alterar(fornecedor));

        [HttpDelete("{id}")]
        [SwaggerOperation(Description = "Exclui o fornecedor do sistema.")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> Excluir([FromRoute] Guid Id) =>
            Ok(await _fornecedorService.Excluir(Id));

        [HttpGet("{id}")]
        [SwaggerOperation(Description = "Obtém um fornecedor com todos os dados.")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> Obter([FromRoute] Guid Id) =>
            Ok(await _fornecedorService.Obter(Id));

        [HttpGet()]
        [SwaggerOperation(Description = "Obtém a lista com todos os dados.")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> Obter() =>
            Ok(await _fornecedorService.Obter());

        [HttpGet("drop-down")]
        [SwaggerOperation(Description = "Obtém a lista apenas com os campos 'Id' e 'Descrição'")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> ObterDropDown() =>
            Ok(await _fornecedorService.ObterDropDown());
    }
}
