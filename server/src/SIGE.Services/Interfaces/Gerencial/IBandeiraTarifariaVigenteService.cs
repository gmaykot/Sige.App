using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Gerencial.BandeiraTarifaria;

namespace SIGE.Services.Interfaces.Gerencial
{
    public interface IBandeiraTarifariaVigenteService : IBaseInterface<BandeiraTarifariaVigenteDto>
    {
        Task<Response> ObterPorBandeira(Guid Id);
    }
}
