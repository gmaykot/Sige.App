using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Gerencial.Concessionaria;

namespace SIGE.Services.Interfaces.Gerencial
{
    public interface IConcessionariaService : IBaseInterface<ConcessionariaDto>
    {
        Task<Response> ObterPorPontoMedicao(Guid Id);
    }
}
