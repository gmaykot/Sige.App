using Microsoft.AspNetCore.Mvc;
using SIGE.Core.Models.Dto.Gerencial.BandeiraTarifaria;
using SIGE.Core.Models.Sistema.Gerencial.BandeiraTarifaria;
using SIGE.Services.Interfaces;

namespace SIGE.Controller.Gerencial
{
    [Route("bandeira-tarifaria")]
    public class BandeiraTarifariaController(IBaseInterface<BandeiraTarifariaDto, BandeiraTarifariaModel> service) : BaseController<BandeiraTarifariaDto, BandeiraTarifariaModel>(service) { }
}
