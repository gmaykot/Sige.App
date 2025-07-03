using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Gerencial.Empresa;
using SIGE.Core.Models.Sistema.Gerencial.Empresa;
using SIGE.Services.Interfaces;
using Swashbuckle.AspNetCore.Annotations;

namespace SIGE.Controller.Gerencial
{
    [Route("empresa")]
    public class EmpresaController(IBaseInterface<EmpresaDto, EmpresaModel> service) : BaseController<EmpresaDto, EmpresaModel>(service)
    {
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
                orderBy: o => o.OrderBy(e => e.NomeFantasia),
                include: i => i.Include(e => e.Contatos).Include(e => e.AgentesMedicao));
            return Ok(response);
        }
    }
}
