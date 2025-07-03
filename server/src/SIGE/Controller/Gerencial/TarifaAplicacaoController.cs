using Microsoft.AspNetCore.Mvc;
using SIGE.Core.Models.Dto.Gerencial;
using SIGE.Core.Models.Sistema.Gerencial;
using SIGE.Services.Interfaces;

namespace SIGE.Controller.Gerencial
{
    [Route("tarifa-aplicacao")]
    public class TarifaAplicacaoController(IBaseInterface<TarifaAplicacaoDto, TarifaAplicacaoModel> service) : BaseController<TarifaAplicacaoDto, TarifaAplicacaoModel>(service) { }
}
