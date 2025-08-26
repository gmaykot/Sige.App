using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Geral;
using SIGE.Core.Models.Sistema.Geral;

namespace SIGE.Services.Interfaces.Geral
{
    public interface IFaturamentoCoenelService : IBaseInterface<FaturamentoCoenelDto, FaturamentoCoenelModel>
    {
        Task<Response> ObterPorPontoMedicao(Guid Id);
    }
}
