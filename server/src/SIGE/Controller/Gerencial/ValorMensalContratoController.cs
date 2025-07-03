using Microsoft.AspNetCore.Mvc;
using SIGE.Core.Models.Dto.Gerencial.Contrato;
using SIGE.Core.Models.Sistema.Gerencial.Contrato;
using SIGE.Services.Interfaces;

namespace SIGE.Controller.Gerencial
{
    [Route("valor-mensal")]
    public class ValorMensalContratoController(IBaseInterface<ValorMensalContratoDto, ValorMensalContratoModel> service) : BaseController<ValorMensalContratoDto, ValorMensalContratoModel>(service) { }
}
