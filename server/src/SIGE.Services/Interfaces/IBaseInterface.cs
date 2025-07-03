using SIGE.Core.Models.Defaults;
using System.Linq.Expressions;

namespace SIGE.Services.Interfaces
{
    public interface IBaseInterface<T, M>
    {
        Task<Response> Incluir(T req);
        Task<Response> Obter(Guid Id);
        Task<Response> Obter();
        Task<Response> Alterar(T req);
        Task<Response> Excluir(Guid Id);
        Task<Response> ObterDropDown();
        Task<Response> ObterSource();

        Task<Response> Obter(
                    Expression<Func<M, bool>>? filtro = null,
                    Func<IQueryable<M>, IOrderedQueryable<M>>? orderBy = null,
                    params Expression<Func<M, object>>[] includes);
    }
}
