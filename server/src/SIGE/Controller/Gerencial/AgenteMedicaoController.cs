using Microsoft.AspNetCore.Mvc;
using SIGE.Core.Models.Dto.Gerencial.Empresa;
using SIGE.Core.Models.Sistema.Gerencial.Empresa;
using SIGE.Services.Interfaces;

namespace SIGE.Controller.Gerencial
{
    [Route("agente-medicao")]
    public class AgenteMedicaoController(IBaseInterface<AgenteMedicaoDto, AgenteMedicaoModel> service) : BaseController<AgenteMedicaoDto, AgenteMedicaoModel>(service) { }
}
