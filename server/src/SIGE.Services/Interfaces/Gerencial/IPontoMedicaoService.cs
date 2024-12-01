using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Gerencial.Empresa;

namespace SIGE.Services.Interfaces.Gerencial
{
    public interface IPontoMedicaoService : IBaseInterface<PontoMedicaoDto>
    {
        Task<Response> ObterDropDownPorEmpresa(Guid EmpresaId);
    }
}
