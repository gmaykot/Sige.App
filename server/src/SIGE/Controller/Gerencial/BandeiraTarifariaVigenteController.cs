using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Gerencial.BandeiraTarifaria;
using SIGE.Core.Models.Sistema.Gerencial.BandeiraTarifaria;
using SIGE.Services.Interfaces;
using Swashbuckle.AspNetCore.Annotations;

namespace SIGE.Controller.Gerencial
{
    [ApiController]
    [Route("bandeira-tarifaria-vigente")]
    public class BandeiraTarifariaVigenteController(IBaseInterface<BandeiraTarifariaVigenteDto, BandeiraTarifariaVigenteModel> service) : BaseController<BandeiraTarifariaVigenteDto, BandeiraTarifariaVigenteModel>(service)
    {
        [HttpGet("bandeira/{id}")]
        [SwaggerOperation(Description = "Obtém um com todos os dados.")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> ObterPorBandeira([FromRoute] Guid Id)
        {
            var response = await _service.Obter(
                filtro: b => b.BandeiraTarifaria.Id == Id,
                orderBy: q => q.OrderByDescending(x => x.MesReferencia),
                include: i => i.Include(b => b.BandeiraTarifaria));

            return Ok(response);
        }
    }
}