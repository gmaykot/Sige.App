using Microsoft.AspNetCore.Mvc;
using SIGE.Core.Models.Dto.Gerencial.Concessionaria;
using SIGE.Core.Models.Sistema.Gerencial.Concessionaria;
using SIGE.Services.Interfaces;

namespace SIGE.Controller.Gerencial
{
    [Route("valor-concessionaria")]
    public class ValorConcessionariaController(IBaseInterface<ValorConcessionariaDto, ValorConcessionariaModel> service)
        : BaseController<ValorConcessionariaDto, ValorConcessionariaModel>(service)
    { }
}
