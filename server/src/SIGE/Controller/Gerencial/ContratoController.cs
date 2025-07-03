using Microsoft.AspNetCore.Mvc;
using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Gerencial.Contrato;
using SIGE.Core.Models.Sistema.Gerencial.Contrato;
using SIGE.Services.Interfaces.Gerencial;
using Swashbuckle.AspNetCore.Annotations;

namespace SIGE.Controller.Gerencial
{
    [Route("contrato")]
    public class ContratoController(IContratoService service) : BaseController<ContratoDto, ContratoModel>(service)
    {
        [HttpPost("empresa-grupo")]
        [SwaggerOperation(Description = "Efetua a inclusão de uma empresa no grupo de contrato.")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> IncluirEmpresaGrupo([FromBody] ContratoEmpresaDto req) =>
            Ok(await service.IncluirEmpresaGrupo(req));

        [HttpDelete("empresa-grupo/{id}")]
        [SwaggerOperation(Description = "Efetua a remoção de uma empresa no grupo de contrato.")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> ExcluirEmpresaGrupo([FromRoute] Guid id) =>
            Ok(await service.ExcluirEmpresaGrupo(id));
    }
}
