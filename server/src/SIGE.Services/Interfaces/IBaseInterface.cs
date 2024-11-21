using SIGE.Core.Models.Defaults;

namespace SIGE.Services.Interfaces
{
    public interface IBaseInterface<T>
    {
        Task<Response> Incluir(T req);
        Task<Response> Obter(Guid Id);
        Task<Response> Obter();
        Task<Response> Alterar(T req);
        Task<Response> Excluir(Guid Id);
    }
}
