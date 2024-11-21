using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Fornecedor;

namespace SIGE.Services.Interfaces
{
    public interface IContatoService : IBaseInterface<ContatoDto>
    {
        Task<Response> ObterPorFornecedor(Guid Id);        
    }
}
