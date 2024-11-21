using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Concessionaria;

namespace SIGE.Services.Interfaces
{
    public interface IConcessionariaService : IBaseInterface<ConcessionariaDto>
    {
        Task<Response> ObterDropDown();
    }
}

