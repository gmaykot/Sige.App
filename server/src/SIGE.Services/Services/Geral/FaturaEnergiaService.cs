using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SIGE.Core.Enumerators;
using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Default;
using SIGE.Core.Models.Dto.Geral.FaturaEnergia;
using SIGE.Core.Models.Requests;
using SIGE.Core.Models.Sistema.Geral.FaturaEnergia;
using SIGE.DataAccess.Context;
using SIGE.Services.Interfaces.Geral;

namespace SIGE.Services.Services.Geral
{
    public class FaturaEnergiaService(AppDbContext appDbContext, IMapper mapper, RequestContext requestContext) : IFaturaEnergiaService
    {
        private readonly RequestContext _requestContext = requestContext;
        private readonly AppDbContext _appDbContext = appDbContext;
        private readonly IMapper _mapper = mapper;

        public async Task<Response> Alterar(FaturaEnergiaDto req)
        {
            var fornecedor = await _appDbContext.FaturasEnergia.Include(f => f.LancamentosAdicionais).FirstOrDefaultAsync(f => f.Id == req.Id);
            var lancamentos = fornecedor.LancamentosAdicionais;
            _mapper.Map(req, fornecedor);
            fornecedor.LancamentosAdicionais = null;
            _appDbContext.LancamentosAdicionais.RemoveRange(lancamentos);

            _ = await _appDbContext.SaveChangesAsync();

            if (!req.LancamentosAdicionais.IsNullOrEmpty())
            {
                lancamentos = _mapper.Map<IEnumerable<LancamentoAdicionalModel>>(req.LancamentosAdicionais);
                await _appDbContext.AddRangeAsync(lancamentos);
                _ = await _appDbContext.SaveChangesAsync();
            }

            return new Response().SetOk().SetMessage("Dados alterados com sucesso.");
        }

        public async Task<Response> Excluir(Guid Id)
        {
            var ret = await _appDbContext.FaturasEnergia.FirstOrDefaultAsync(f => f.Id.Equals(Id));

            _appDbContext.FaturasEnergia.Remove(ret);
            _ = await _appDbContext.SaveChangesAsync();

            return new Response().SetOk().SetMessage("Fatura excluída com sucesso.");
        }

        public async Task<Response> Incluir(FaturaEnergiaDto req)
        {
            if (req.Id != null)
                return await Alterar(req);

            var fatura = _mapper.Map<FaturaEnergiaModel>(req);
            _ = await _appDbContext.AddAsync(fatura);
            _ = await _appDbContext.SaveChangesAsync();

            return new Response().SetOk().SetData(_mapper.Map<FaturaEnergiaDto>(fatura)).SetMessage("Fartura cadastrada com sucesso.");
        }

        public async Task<Response> Obter(Guid Id)
        {
            var ret = new Response();
            var res = await _appDbContext.FaturasEnergia.FirstOrDefaultAsync(e => e.Id.Equals(Id));
            if (res != null)
                return ret.SetOk().SetData(_mapper.Map<FaturaEnergiaDto>(res));

            return ret.SetNotFound().AddError(ETipoErro.INFORMATIVO, $"Não existe fatura com o id {Id}.");
        }

        public async Task<Response> Obter()
        {
            var ret = new Response();
            var res = await _appDbContext.FaturasEnergia.Include(f => f.Concessionaria).Include(f => f.PontoMedicao).Include(f => f.LancamentosAdicionais).ToListAsync();
            if (res.Count > 0)
                return ret.SetOk().SetData(_mapper.Map<IEnumerable<FaturaEnergiaDto>>(res.OrderByDescending(f => f.MesReferencia).ThenBy(f => f.PontoMedicao.Nome)));

            return ret.SetNotFound().AddError(ETipoErro.INFORMATIVO, "Não existe fatura ativo.");
        }

        public async Task<Response> ObterDropDown()
        {
            var ret = new Response();
            var res = await _appDbContext.FaturasEnergia.ToListAsync();
            if (res.Count > 0)
                return ret.SetOk().SetData(_mapper.Map<IEnumerable<DropDownDto>>(res).OrderBy(d => d.Descricao));

            return ret.SetNotFound().AddError(ETipoErro.INFORMATIVO, "Não existe fartura ativa.");
        }
    }
}
