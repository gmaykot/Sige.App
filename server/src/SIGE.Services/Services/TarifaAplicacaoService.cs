using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SIGE.Core.Enumerators;
using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.TarifaAplicacao;
using SIGE.Core.Models.Sistema.TarifaAplicacao;
using SIGE.DataAccess.Context;
using SIGE.Services.Interfaces;

namespace SIGE.Services.Services
{
    public class TarifaAplicacaoService(AppDbContext appDbContext, IMapper mapper) : IBaseInterface<TarifaAplicacaoDto>
    {
        private readonly AppDbContext _appDbContext = appDbContext;
        private readonly IMapper _mapper = mapper;

        public async Task<Response> Alterar(TarifaAplicacaoDto req)
        {
            var empresa = await _appDbContext.TarifasAplicacao.FindAsync(req.Id);

            _mapper.Map(req, empresa);
            _ = await _appDbContext.SaveChangesAsync();

            return (new Response()).SetOk().SetMessage("Dados alterados com sucesso.");
        }

        public async Task<Response> Excluir(Guid Id)
        {
            var ret = await _appDbContext.TarifasAplicacao.FindAsync(Id);
            _appDbContext.TarifasAplicacao.Remove(ret);
            _ = await _appDbContext.SaveChangesAsync();

            return (new Response()).SetOk().SetMessage("Dados excluídos com sucesso.");
        }

        public async Task<Response> Incluir(TarifaAplicacaoDto req)
        {
            var res = _mapper.Map<TarifaAplicacaoModel>(req);
            _ = await _appDbContext.AddAsync(res);
            _ = await _appDbContext.SaveChangesAsync();

            return (new Response()).SetOk().SetData(_mapper.Map<TarifaAplicacaoDto>(res)).SetMessage("Dados cadastrados com sucesso.");
        }

        public async Task<Response> Obter(Guid Id)
        {
            var ret = new Response();
            var res = await _appDbContext.TarifasAplicacao.FindAsync(Id);
            if (res != null)
                return ret.SetOk().SetData(_mapper.Map<TarifaAplicacaoDto>(res));

            return ret.SetNotFound()
                .AddError(ETipoErro.INFORMATIVO, $"Não existe registro com o Id {Id}.");
        }

        public async Task<Response> Obter()
        {
            var ret = new Response();
            var res = await _appDbContext.TarifasAplicacao.Include(t => t.Concessionaria).ToListAsync();
            if (res.Count > 0)
                return ret.SetOk().SetData(_mapper.Map<IEnumerable<TarifaAplicacaoDto>>(res));

            return ret.SetNotFound()
                .AddError(ETipoErro.INFORMATIVO, $"Não existem registros cadastrados.");
        }

        public Task<Response> ObterDropDown()
        {
            throw new NotImplementedException();
        }
    }
}
