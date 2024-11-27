using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Gerencial;

namespace SIGE.Services.Interfaces.Gerencial
{
    public interface IContatoService : IBaseInterface<ContatoDto>
    {
        Task<Response> ObterPorFornecedor(Guid Id);
    }
}
