using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Concessionaria;

namespace SIGE.Services.Interfaces
{
    public interface IImpostoConcessionariaService : IBaseInterface<ImpostoConcessionariaDto>
    {
        Task<Response> ObterPorConcessionaria(Guid Id);
    }
}
