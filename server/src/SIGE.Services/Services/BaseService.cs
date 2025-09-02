using System.Linq.Expressions;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using MySqlConnector;
using SIGE.Core.AppLogger;
using SIGE.Core.Enumerators;
using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Default;
using SIGE.DataAccess.Context;
using SIGE.Services.Interfaces;

namespace SIGE.Services.Services {
    public class BaseService<T, M>(AppDbContext appDbContext, IMapper mapper, IAppLogger appLogger) : IBaseInterface<T, M> where M : class where T : class {
        protected readonly AppDbContext _appDbContext = appDbContext;
        protected readonly IMapper _mapper = mapper;
        protected readonly IAppLogger _appLogger = appLogger;

        /// <summary>
        /// Altera o registro com base no ID da entidade.
        /// </summary>
        public virtual async Task<Response> Alterar(T req) {
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

            _appLogger.LogUpdateObject($"Registro {typeof(M).Name} alterado com sucesso.", (Guid)id);

            return new Response().SetOk().SetMessage("Registro alterado com sucesso.");
        }

        /// <summary>
        /// Exclui o registro com base no ID.
        /// </summary>
        public virtual async Task<Response> Excluir(Guid id) {
            var entity = await _appDbContext.Set<M>().FindAsync(id);
            if (entity is null)
                return new Response().SetNotFound()
                    .AddError(ETipoErro.INFORMATIVO, $"Registro com Id {id} não encontrado.");

            _appDbContext.Set<M>().Remove(entity);
            await _appDbContext.SaveChangesAsync();

            _appLogger.LogDeleteObject($"Registro {typeof(M).Name} excluído com sucesso.", id);

            return new Response().SetOk().SetMessage("Registro excluído com sucesso.");
        }

        /// <summary>  
        /// Inclui um novo registro.  
        /// </summary>  
        public virtual async Task<Response> Incluir(T req) {
            var idProperty = typeof(T).GetProperty("Id");

            if (idProperty == null)
                return new Response().SetBadRequest()
                    .AddError(ETipoErro.ERRO, "A entidade não possui a propriedade 'Id'.");

            var id = idProperty.GetValue(req);

            if (id != null && id is Guid guidId && guidId != Guid.Empty)
                return await Alterar(req);

            var entity = _mapper.Map<M>(req);
            await _appDbContext.AddAsync(entity);
            await _appDbContext.SaveChangesAsync();

            _appLogger.LogInformation($"Registro {typeof(M).Name} incluído com sucesso.");

            return new Response().SetOk()
                .SetData(_mapper.Map<T>(entity))
                .SetMessage("Registro cadastrado com sucesso.");
        }

        /// <summary>
        /// Obtém um registro pelo ID.
        /// </summary>
        public virtual async Task<Response> Obter(Guid id) {
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
            Func<IQueryable<M>, IQueryable<M>>? include = null) {
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
            Func<IQueryable<M>, IQueryable<M>>? include = null) {
            return await Obter<T>(filtro, orderBy, include);
        }

        /// <summary>
        /// Obtém registros com filtro opcional.
        /// </summary>
        public virtual async Task<Response> Obter<TD>(
            Expression<Func<M, bool>>? filtro = null,
            Func<IQueryable<M>, IOrderedQueryable<M>>? orderBy = null,
            Func<IQueryable<M>, IQueryable<M>>? include = null) where TD : class {
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
        public virtual async Task<Response> ObterSource() {
            return new Response().SetServiceUnavailable()
                .AddError(ETipoErro.INFORMATIVO, "Serviço para carregamento de registros não implementado.");
        }

        /// <summary>
        /// Método auxiliar para obter todos os registros da entidade.
        /// </summary>
        public virtual async Task<Response> Load(Guid id) {
            return new Response().SetServiceUnavailable()
                .AddError(ETipoErro.INFORMATIVO, "Serviço para busca de registro não implementado.");
        }


        protected async Task<Response> ExecutarSource(string sql, MySqlParameter[]? parameters = null) {
            return await ExecutarSource<T>(sql, parameters);
        }

        protected async Task<Response> ExecutarSource<TDto>(string sql, MySqlParameter[]? parameters = null) {
            var ret = new Response();

            var res = await _appDbContext.Database.SqlQueryRaw<TDto>(sql, parameters ?? []).ToListAsync();

            if (res != null && res.Count != 0)
                return ret.SetOk().SetData(_mapper.Map<IEnumerable<TDto>>(res));

            return ret.SetNotFound()
                .AddError(ETipoErro.INFORMATIVO, "Não existem registros cadastrados.");
        }

        protected async Task<Response> ExecutarSourceSingle<TDto>(string sql, MySqlParameter[]? parameters = null, Func<IQueryable<TDto>, IOrderedQueryable<TDto>>? orderBy = null) {
            var ret = new Response();

            var query = _appDbContext.Database.SqlQueryRaw<TDto>(sql, parameters ?? []);

            if (orderBy != null)
                query = orderBy(query);

            var res = await query.ToListAsync();

            if (res != null)
                return ret.SetOk().SetData(_mapper.Map<TDto>(res.FirstOrDefault()));

            return ret.SetNotFound()
                .AddError(ETipoErro.INFORMATIVO, "Não existem registros cadastrados.");
        }

        public async Task<Response> ToogleAtivo(T req) {
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

            var ativoPropEntity = typeof(M).GetProperty("Ativo");
            var ativoPropReq = typeof(T).GetProperty("Ativo");

            if (ativoPropEntity == null || ativoPropReq == null)
                return new Response().SetBadRequest()
                    .AddError(ETipoErro.ERRO, "A entidade não possui a propriedade 'Ativo'.");

            var valorAtivo = ativoPropReq.GetValue(req);
            ativoPropEntity.SetValue(entity, valorAtivo);

            await _appDbContext.SaveChangesAsync();

            _appLogger.LogInformation($"Registro {typeof(M).Name} com Id {id} ToogleAtivo com sucesso.");

            return new Response().SetOk().SetMessage("Registro alterado com sucesso.");
        }
    }
}
