using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Empresa;

namespace SIGE.Services.Interfaces
{
    public interface IEmpresaService : IBaseInterface<EmpresaDto>
    {
        Task<Response> ObterDropDown();
    }
}
