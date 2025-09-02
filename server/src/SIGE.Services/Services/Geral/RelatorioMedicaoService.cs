using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SIGE.Core.Enumerators;
using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Geral.RelatorioMedicao;
using SIGE.Core.Models.Requests;
using SIGE.Core.Models.Sistema.Geral.Medicao;
using SIGE.Core.SQLFactory;
using SIGE.DataAccess.Context;
using SIGE.Services.Interfaces.Geral;

namespace SIGE.Services.Services.Geral {
    public class RelatorioMedicaoService(AppDbContext appDbContext, IMapper mapper) : IRelatorioMedicaoService {
        private readonly AppDbContext _appDbContext = appDbContext;
        private readonly IMapper _mapper = mapper;

        public async Task<Response> Alterar(RelatorioMedicaoDto req) {
            var ret = new Response();
            var res = await _appDbContext.RelatoriosMedicao.FindAsync(req.Id);
            _mapper.Map(req, res);

            _appDbContext.SaveChanges();

            return ret.SetOk();
        }

        public async Task<Response> ListarRelatorios(RelatorioMedicaoRequest req) {
            var ret = new Response();
            var res = await _appDbContext.Database.SqlQueryRaw<RelatorioMedicaoListDto>(RelatorioMedicaoFactory.ListaRelatoriosMedicao(req)).ToListAsync();
            if (res != null && res.Count != 0)
                return ret.SetOk().SetData(res.DistinctBy(m => m.DescGrupo).OrderByDescending(m => m.MesReferencia));

            return ret.SetNotFound().AddError(ETipoErro.INFORMATIVO, $"Sem relatório de medição no período.");
        }

        public async Task<Response> Obter(Guid contratoId, DateTime mesReferencia) {
            var ret = new Response();

            var rel = await _appDbContext.RelatoriosMedicao.IgnoreAutoIncludes().FirstOrDefaultAsync(r => r.ContratoId.Equals(contratoId) && r.MesReferencia.Equals(mesReferencia));
            var res = await _appDbContext.Database.SqlQueryRaw<RelatorioMedicaoDto>(RelatorioMedicaoFactory.ValoresRelatoriosMedicao(contratoId, mesReferencia, null)).FirstOrDefaultAsync();
            if (res == null)
                return ret.SetNotFound().AddError(ETipoErro.INFORMATIVO, $"Verifique a medição do mês de referência e os valores contratuais cadastrados.");

            res.ValoresAnaliticos = [];
            res.ContratoId = contratoId;

            var empresas = await _appDbContext.Database.SqlQueryRaw<Guid>(ContratosFactory.EmpresasPorContrato(contratoId)).ToListAsync();

            empresas.ForEach(empresaId => {
                var valores = _appDbContext.Database.SqlQueryRaw<ValorAnaliticoMedicaoDto>(RelatorioMedicaoFactory.ValoresRelatoriosMedicao(contratoId, mesReferencia, empresaId)).FirstOrDefault();
                if (valores != null) {
                    res.Icms = valores.Icms;
                    res.Proinfa = valores.Proinfa;

                    res.ValoresAnaliticos.Add(valores);
                }
            });

            res.MesReferencia = mesReferencia;
            res.DataEmissao = DataSige.Hoje();

            if (rel == null) {
                res.Id = Guid.Empty;
                res.Fase = EFaseMedicao.RELATORIO_MEDICAO;
                await _appDbContext.RelatoriosMedicao.AddAsync(_mapper.Map<RelatorioMedicaoModel>(res));
            }
            else {
                res.Id = rel.Id;
                _mapper.Map(res, rel);
            }

            _appDbContext.SaveChanges();

            return ret.SetOk().SetData(res);
        }
    }
}
