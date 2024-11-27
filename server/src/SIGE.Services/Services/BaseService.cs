using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SIGE.Core.Enumerators;
using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Default;
using SIGE.DataAccess.Context;
using SIGE.Services.Interfaces;

namespace SIGE.Services.Services
{
    public class BaseService<T, M>(AppDbContext appDbContext, IMapper mapper) : IBaseInterface<T> where M : class
    {
        protected readonly AppDbContext _appDbContext = appDbContext;
        protected readonly IMapper _mapper = mapper;

        public virtual async Task<Response> Alterar(T req)
        {
            var idProperty = typeof(T).GetProperty("Id") ?? throw new InvalidOperationException("A entidade não possui a propriedade 'Id'.");
            var id = idProperty.GetValue(req);

            var ret = await _appDbContext.Set<M>().FindAsync(id);
            _mapper.Map(req, ret);
            _ = await _appDbContext.SaveChangesAsync();

            return new Response().SetOk().SetMessage("Dados alterados com sucesso.");
        }

        public virtual async Task<Response> Excluir(Guid Id)
        {
            var ret = await _appDbContext.Set<M>().FindAsync(Id);
            _appDbContext.Set<M>().Remove(ret);
            _ = await _appDbContext.SaveChangesAsync();

            return new Response().SetOk().SetMessage("Dados excluídos com sucesso.");
        }

        public virtual async Task<Response> Incluir(T req)
        {
            var res = _mapper.Map<M>(req);
            _ = await _appDbContext.AddAsync(res);
            _ = await _appDbContext.SaveChangesAsync();

            return new Response().SetOk().SetData(_mapper.Map<T>(res)).SetMessage("Dados cadastrados com sucesso.");
        }

        public virtual async Task<Response> Obter(Guid Id)
        {
            var ret = new Response();
            var res = await _appDbContext.Set<M>().FindAsync(Id);
            if (res != null)
                return ret.SetOk().SetData(_mapper.Map<T>(res));

            return ret.SetNotFound()
                .AddError(ETipoErro.INFORMATIVO, $"Não existe registro com o Id {Id}.");
        }

        public virtual async Task<Response> Obter()
        {
            var ret = new Response();
            var res = await _appDbContext.Set<M>().ToListAsync();
            if (res.Count > 0)
                return ret.SetOk().SetData(_mapper.Map<IEnumerable<T>>(res));

            return ret.SetNotFound()
                .AddError(ETipoErro.INFORMATIVO, $"Não existem registros cadastrados.");
        }

        public async Task<Response> ObterDropDown()
        {
            var ret = new Response();
            var res = await _appDbContext.Set<M>().ToListAsync();
            if (res.Count > 0)
                return ret.SetOk().SetData(_mapper.Map<IEnumerable<DropDownDto>>(res).OrderBy(d => d.Descricao));

            return ret.SetNotFound()
                .AddError(ETipoErro.INFORMATIVO, "Não existem registros cadastrados.");
        }
    }
}
