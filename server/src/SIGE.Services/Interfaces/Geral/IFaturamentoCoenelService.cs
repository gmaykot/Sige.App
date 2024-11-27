using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.FaturmentoCoenel;

namespace SIGE.Services.Interfaces.Geral
{
    public interface IFaturamentoCoenelService : IBaseInterface<FaturamentoCoenelDto>
    {
        Task<Response> ObterPorPontoMedicao(Guid Id);
    }
}
