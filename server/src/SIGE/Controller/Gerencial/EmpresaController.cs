using Microsoft.AspNetCore.Mvc;
using SIGE.Core.Models.Dto.Gerencial.Empresa;
using SIGE.Core.Models.Sistema.Gerencial.Empresa;
using SIGE.Services.Interfaces;

namespace SIGE.Controller.Gerencial
{
    [Route("empresa")]
    public class EmpresaController(IBaseInterface<EmpresaDto, EmpresaModel> service) : BaseController<EmpresaDto, EmpresaModel>(service) { }
}
