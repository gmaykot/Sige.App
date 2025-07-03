using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SIGE.Core.Enumerators;
using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Default;
using SIGE.DataAccess.Context;
using SIGE.Services.Interfaces;
using System.Linq.Expressions;

namespace SIGE.Services.Services
{
    public class BaseService<T, M>(AppDbContext appDbContext, IMapper mapper) : IBaseInterface<T, M> where M : class where T : class
    {
        protected readonly AppDbContext _appDbContext = appDbContext;
        protected readonly IMapper _mapper = mapper;

        /// <summary>
        /// Altera o registro com base no ID da entidade.
        /// </summary>
        public virtual async Task<Response> Alterar(T req)
        {
            var idProperty = typeof(T).GetProperty("Id");

            if (idProperty == null)
                return new Response().SetBadRequest()
                    .AddError(ETipoErro.ERRO, "A entidade não possui a propriedade 'Id'.");

            var id = idProperty.GetValue(req);

            if (id == null)
                return new Response().SetBadRequest()
                    .AddError(ETipoErro.ERRO, "O Id informado é inválido.");

            var entity = await _appDbContext.Set<M>().FindAsync(id);
            if (entity is null)
                return new Response().SetNotFound()
                    .AddError(ETipoErro.INFORMATIVO, $"Registro com Id {id} não encontrado.");

            _mapper.Map(req, entity);
            await _appDbContext.SaveChangesAsync();

            return new Response().SetOk().SetMessage("Registro alterado com sucesso.");
        }

        /// <summary>
        /// Exclui o registro com base no ID.
        /// </summary>
        public virtual async Task<Response> Excluir(Guid id)
        {
            var entity = await _appDbContext.Set<M>().FindAsync(id);
            if (entity is null)
                return new Response().SetNotFound()
                    .AddError(ETipoErro.INFORMATIVO, $"Registro com Id {id} não encontrado.");

            _appDbContext.Set<M>().Remove(entity);
            await _appDbContext.SaveChangesAsync();

            return new Response().SetOk().SetMessage("Registro excluído com sucesso.");
        }

        /// <summary>
        /// Inclui um novo registro.
        /// </summary>
        public virtual async Task<Response> Incluir(T req)
        {
            var entity = _mapper.Map<M>(req);
            await _appDbContext.AddAsync(entity);
            await _appDbContext.SaveChangesAsync();

            return new Response().SetOk()
                .SetData(_mapper.Map<T>(entity))
                .SetMessage("Registro cadastrado com sucesso.");
        }

        /// <summary>
        /// Obtém um registro pelo ID.
        /// </summary>
        public virtual async Task<Response> Obter(Guid id)
        {
            var entity = await _appDbContext.Set<M>().FindAsync(id);
            if (entity != null)
                return new Response().SetOk().SetData(_mapper.Map<T>(entity));

            return new Response().SetNotFound()
                .AddError(ETipoErro.INFORMATIVO, $"Não existe registro com o Id {id}.");
        }

        /// <summary>
        /// Obtém todos os registros em formato de DropDown.
        /// </summary>
        public virtual async Task<Response> ObterDropDown(
            Expression<Func<M, bool>>? filtro = null,
            Func<IQueryable<M>, IQueryable<M>>? include = null)
        {
            IQueryable<M> query = _appDbContext.Set<M>();

            if (include != null)
                query = include(query);

            if (filtro != null)
                query = query.Where(filtro);

            var list = await query.ToListAsync();

            if (list.Count != 0)
                return new Response().SetOk().SetData(_mapper.Map<IEnumerable<DropDownDto>>(list).OrderBy(d => d.Descricao));

            return new Response().SetNotFound()
                .AddError(ETipoErro.INFORMATIVO, "Não existem registros cadastrados.");
        }

        /// <summary>
        /// Obtém registros com filtro opcional.
        /// </summary>
        public virtual async Task<Response> Obter(
            Expression<Func<M, bool>>? filtro = null,
            Func<IQueryable<M>, IOrderedQueryable<M>>? orderBy = null,
            Func<IQueryable<M>, IQueryable<M>>? include = null)
        {
            return await Obter<T>(filtro, orderBy, include);
        }

        /// <summary>
        /// Obtém registros com filtro opcional.
        /// </summary>
        public virtual async Task<Response> Obter<TD>(
            Expression<Func<M, bool>>? filtro = null,
            Func<IQueryable<M>, IOrderedQueryable<M>>? orderBy = null,
            Func<IQueryable<M>, IQueryable<M>>? include = null) where TD : class
        {
            IQueryable<M> query = _appDbContext.Set<M>();

            if (include != null)
                query = include(query);

            if (filtro != null)
                query = query.Where(filtro);

            if (orderBy != null)
                query = orderBy(query);

            var list = await query.ToListAsync();

            if (list.Count != 0)
                return new Response().SetOk().SetData(_mapper.Map<IEnumerable<TD>>(list));

            return new Response().SetNotFound()
                .AddError(ETipoErro.INFORMATIVO, "Não existem registros cadastrados.");
        }

        /// <summary>
        /// Método auxiliar para obter todos os registros da entidade.
        /// </summary>
        public virtual async Task<Response> ObterSource() =>
            new Response().SetServiceUnavailable()
                .AddError(ETipoErro.INFORMATIVO, "Serviço não implementado.");
    }
}
