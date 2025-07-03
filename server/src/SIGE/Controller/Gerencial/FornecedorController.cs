using Microsoft.AspNetCore.Mvc;
using SIGE.Core.Models.Dto.Gerencial;
using SIGE.Core.Models.Sistema.Gerencial;
using SIGE.Services.Interfaces;

namespace SIGE.Controller.Gerencial
{
    [ApiController]
    [Route("fornecedor")]
    public class FornecedorController(IBaseInterface<FornecedorDto, FornecedorModel> service) : BaseController<FornecedorDto, FornecedorModel>(service) { }
}