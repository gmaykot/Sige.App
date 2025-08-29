using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using MySqlConnector;
using SIGE.Core.Enumerators;
using SIGE.Core.Extensions;
using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Geral.FaturaEnergia;
using SIGE.Core.Models.Dto.GerenciamentoMensal;
using SIGE.Core.Models.Sistema.Geral.FaturaEnergia;
using SIGE.Core.SQLFactory;
using SIGE.DataAccess.Context;
using SIGE.Services.Interfaces.Geral;

namespace SIGE.Services.Services.Geral {
    public class FaturaEnergiaService(AppDbContext appDbContext, IMapper mapper) : BaseService<FaturaEnergiaDto, FaturaEnergiaModel>(appDbContext, mapper), IFaturaEnergiaService {
        public override async Task<Response> Alterar(FaturaEnergiaDto req) {
            var fornecedor = await _appDbContext.FaturasEnergia.Include(f => f.LancamentosAdicionais).FirstOrDefaultAsync(f => f.Id == req.Id);
            var lancamentos = fornecedor.LancamentosAdicionais;
            _mapper.Map(req, fornecedor);
            fornecedor.LancamentosAdicionais = null;
            _appDbContext.LancamentosAdicionais.RemoveRange(lancamentos);

            _ = await _appDbContext.SaveChangesAsync();

            if (!req.LancamentosAdicionais.IsNullOrEmpty()) {
                lancamentos = _mapper.Map<IEnumerable<LancamentoAdicionalModel>>(req.LancamentosAdicionais);
                await _appDbContext.AddRangeAsync(lancamentos);
                _ = await _appDbContext.SaveChangesAsync();
            }

            return new Response().SetOk().SetMessage("Dados alterados com sucesso.");
        }

        public async Task<Response> Obter() {
            var ret = new Response();
            var res = await _appDbContext.FaturasEnergia.Include(f => f.Concessionaria).Include(f => f.PontoMedicao).Include(f => f.LancamentosAdicionais).ToListAsync();
            if (res.Count > 0)
                return ret.SetOk().SetData(_mapper.Map<IEnumerable<FaturaEnergiaDto>>(res.OrderByDescending(f => f.MesReferencia).ThenBy(f => f.PontoMedicao.Nome)));

            return ret.SetNotFound().AddError(ETipoErro.INFORMATIVO, "Não existe fatura ativo.");
        }

        public async Task<Response> ObterFaturas(DateOnly? mesReferencia, Guid? pontoMedicaoId) {
            if (mesReferencia == null)
                mesReferencia = DateOnly.FromDateTime(DateTime.Now).GetPrimeiroDiaMes();

            var ret = new Response();
            var res = await _appDbContext.FaturasEnergia.Include(f => f.Concessionaria).Include(f => f.PontoMedicao).Include(f => f.LancamentosAdicionais).Where(f => f.MesReferencia == mesReferencia.Value.GetPrimeiroDiaMes()).ToListAsync();

            if (pontoMedicaoId != null)
                res = res.Where(f => f.PontoMedicaoId == pontoMedicaoId).ToList();

            if (res != null && res.Count != 0)
                return ret.SetOk().SetData(_mapper.Map<IEnumerable<FaturaEnergiaDto>>(res.OrderByDescending(f => f.MesReferencia).ThenBy(f => f.PontoMedicao.Nome)));

            return ret.SetNotFound().AddError(ETipoErro.INFORMATIVO, "Não existe fatura ativo.");
        }

        public async Task<Response> ObterDescontosTusdRetusd(DateTime mesReferencia, Guid pontoMedicaoId) {
            var parameters = new MySqlParameter[]
            {
                new("@MesReferencia", MySqlDbType.Date) { Value = mesReferencia },
                new("@PontoMedicaoId", MySqlDbType.Guid) { Value = pontoMedicaoId },
            };

            return await ExecutarSourceSingle<DescontoTUSDDto>(GerenciamentoMensalFactory.ObterDescontoTusd(), parameters);
        }

        public async Task<Response> ObteLancamentosAdicionais(DateTime mesReferencia, Guid pontoMedicaoId) {
            var ret = new Response();
            var res = await _appDbContext.LancamentosAdicionais.Include(l => l.FaturaEnergia).Where(l => l.FaturaEnergia.MesReferencia.Year == mesReferencia.Year && l.FaturaEnergia.MesReferencia.Month == mesReferencia.Month && l.FaturaEnergia.PontoMedicaoId == pontoMedicaoId).ToListAsync();
            if (res != null && res.Count != 0)

                return ret.SetOk().SetData(_mapper.Map<IEnumerable<LancamentoAdicionalDto>>(res.OrderByDescending(f => f.Descricao)));

            return ret.SetNotFound().AddError(ETipoErro.INFORMATIVO, "Não existem lançamentos no período.");
        }
    }
}
