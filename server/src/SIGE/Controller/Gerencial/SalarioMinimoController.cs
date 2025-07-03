using Microsoft.AspNetCore.Mvc;
using SIGE.Core.Models.Dto.Gerencial;
using SIGE.Core.Models.Sistema.Gerencial;
using SIGE.Services.Interfaces;

namespace SIGE.Controller.Gerencial
{
    [Route("salario-minimo")]
    public class SalarioMinimoController(IBaseInterface<SalarioMinimoDto, SalarioMinimoModel> service) : BaseController<SalarioMinimoDto, SalarioMinimoModel>(service) { }
}
