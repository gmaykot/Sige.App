using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Gerencial.Empresa;
using SIGE.Core.Models.Sistema.Gerencial.Empresa;

namespace SIGE.Services.Interfaces.Gerencial
{
    public interface IPontoMedicaoService : IBaseInterface<PontoMedicaoDto, PontoMedicaoModel>
    {
        Task<Response> ObterDropDownComSegmento();
    }
}
