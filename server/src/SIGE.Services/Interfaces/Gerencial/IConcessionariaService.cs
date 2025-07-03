using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Gerencial.Concessionaria;
using SIGE.Core.Models.Sistema.Gerencial.Concessionaria;

namespace SIGE.Services.Interfaces.Gerencial
{
    public interface IConcessionariaService : IBaseInterface<ConcessionariaDto, ConcessionariaModel>
    {
        Task<Response> ObterPorPontoMedicao(Guid Id);
    }
}
