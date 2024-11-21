using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Fornecedor;

namespace SIGE.Services.Interfaces
{
    public interface IFornecedorService : IBaseInterface<FornecedorDto>
    {
        Task<Response> ObterDropDown();
    }
}
