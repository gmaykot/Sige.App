using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Gerencial.Concessionaria;

namespace SIGE.Services.Interfaces.Gerencial
{
    public interface IImpostoConcessionariaService : IBaseInterface<ImpostoConcessionariaDto>
    {
        Task<Response> ObterPorConcessionaria(Guid Id);
    }
}
