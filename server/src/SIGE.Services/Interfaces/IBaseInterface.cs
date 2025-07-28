using System.Linq.Expressions;
using SIGE.Core.Models.Defaults;

namespace SIGE.Services.Interfaces {
    public interface IBaseInterface<T, M> {
        Task<Response> Incluir(T req);
        Task<Response> Obter(Guid Id);
        Task<Response> Alterar(T req);
        Task<Response> Excluir(Guid Id);
        Task<Response> Load(Guid id);
        Task<Response> ObterSource();
        Task<Response> ToogleAtivo(T req);

        Task<Response> ObterDropDown(Expression<Func<M, bool>>? filtro = null, Func<IQueryable<M>, IQueryable<M>>? include = null);
        Task<Response> Obter(Expression<Func<M, bool>>? filtro = null, Func<IQueryable<M>, IOrderedQueryable<M>>? orderBy = null, Func<IQueryable<M>, IQueryable<M>>? include = null);
        Task<Response> Obter<TD>(Expression<Func<M, bool>>? filtro = null, Func<IQueryable<M>, IOrderedQueryable<M>>? orderBy = null, Func<IQueryable<M>, IQueryable<M>>? include = null) where TD : class;
    }
}
