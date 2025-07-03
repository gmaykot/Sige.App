using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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

        [HttpGet]
        [SwaggerOperation(Description = "Obtém a lista com todos os registros.")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public override async Task<IActionResult> Obter()
        {
            var response = await _service.Obter(
                filtro: null,
                orderBy: o => o.OrderBy(e => e.DscGrupo),
                include: i => i.Include(c => c.Fornecedor)
                .Include(c => c.ContratoEmpresas).ThenInclude(c => c.Empresa)
                .Include(c => c.ValoresAnuaisContrato).ThenInclude(c => c.ValoresMensaisContrato));
            return Ok(response);
        }
    }
}
