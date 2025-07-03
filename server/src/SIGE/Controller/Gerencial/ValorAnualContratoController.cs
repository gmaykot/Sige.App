using Microsoft.AspNetCore.Mvc;
using SIGE.Core.Models.Dto.Gerencial.Contrato;
using SIGE.Core.Models.Sistema.Gerencial.Contrato;
using SIGE.Services.Interfaces;

namespace SIGE.Controller.Gerencial
{
    [Route("valor-anual")]
    public class ValorAnualContratoController(IBaseInterface<ValorAnualContratoDto, ValorAnualContratoModel> service)
        : BaseController<ValorAnualContratoDto, ValorAnualContratoModel>(service)
    { }
}
