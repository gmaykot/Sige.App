using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using SIGE.Core.Enumerators;
using SIGE.Core.Extensions;
using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Administrativo.Ccee;
using SIGE.Core.Models.Dto.Geral.Medicao;
using SIGE.Core.Models.Dto.Gerencial.Contrato;
using SIGE.Core.Models.Dto.Gerencial.Empresa;
using SIGE.Core.Models.Sistema.Geral.Medicao;
using SIGE.Core.SQLFactory;
using SIGE.DataAccess.Context;
using SIGE.Services.Custom;
using SIGE.Services.Interfaces.Externo;
using SIGE.Services.Interfaces.Geral;

namespace SIGE.Services.Services.Geral
{
    public class MedicaoService(AppDbContext appDbContext, IMapper mapper, IIntegracaoCceeService integracaoCceeService, ICustomLoggerService loggerService) : IMedicaoService
    {
        private readonly AppDbContext _appDbContext = appDbContext;
        private readonly IMapper _mapper = mapper;
        private readonly IIntegracaoCceeService _integracaoCceeService = integracaoCceeService;
        private readonly ICustomLoggerService _loggerService = loggerService;

        public async Task<Response> CalcularMedicao(MedicaoDto req)
        {
            var ret = new Response();
            var res = await _appDbContext.Contratos.AsNoTracking().Include(c => c.ContratoEmpresas).Include(c => c.Fornecedor).FirstOrDefaultAsync(c => c.Status.Equals(EStatusContrato.ATIVO));
            if (res == null)
                return ret.SetNotFound().AddError(ETipoErro.INFORMATIVO, $"Não existe contrato ativo para a empresa com o Id {req.EmpresaId}.");

            var cont = _mapper.Map<ContratoDto>(res);
            cont.DescFornecedor = res.Fornecedor.Nome;

            var resMed = new ResultadoMedicaoDto()
            {
                DataMedicao = DateTime.Now,
                EmpresaId = req.EmpresaId.ThrowIfNull(),
                Contrato = cont,
            };

            return ret.SetOk().SetData(resMed);
        }

        public async Task<Response> ListarMedicoes(MedicaoDto req)
        {
            var ret = new Response();
            var res = await _appDbContext.Database.SqlQueryRaw<MedicaoDto>(MedicoesFactory.ListaMedicoes(req)).ToListAsync();
            if (res != null && res.Count != 0)
            {
                return ret.SetOk().SetData(res.DistinctBy(m => m.PontoMedicaoId).OrderByDescending(m => m.Periodo));
            }

            return ret.SetNotFound().AddError(ETipoErro.INFORMATIVO, $"Sem medições no período.");
        }

        public async Task<Response> ListaMedicoesPorContrato(Guid contratoId, DateTime periodoMedicao)
        {
            var ret = new Response();
            var res = await _appDbContext.Database.SqlQueryRaw<ListaMedicoesPorContratoDto>(MedicoesFactory.ListaMedicoesPorContrato(contratoId, periodoMedicao)).ToListAsync();
            if (res != null && res.Count != 0)
            {
                return ret.SetOk().SetData(res);
            }

            return ret.SetNotFound().AddError(ETipoErro.INFORMATIVO, $"Sem medições no período.");
        }

        public async Task<Response> ColetarMedicoes(ColetaMedicaoDto req)
        {
            var ret = new Response();
            await _loggerService.LogAsync(LogLevel.Information, $"Solicitação de coleta geral para {req.Periodo.ToDate()}");
            foreach (var med in req.Medicoes.DistinctBy(m => m.Id))
            {
                var ccee = new IntegracaoCceeBaseDto()
                {
                    Periodo = req.Periodo.ToDate(),
                    EmpresaId = med.EmpresaId.ToGuid(),
                    CodAgente = med.CodAgente,
                    PontoMedicao = med.PontoMedicao
                };

                var consumoRecente = await _appDbContext.ConsumosMensais.Include(c => c.Medicoes).FirstOrDefaultAsync(c => c.MesReferencia.Equals(req.Periodo) && c.PontoMedicaoId == med.PontoMedicaoId);

                if (consumoRecente != null)
                {
                    _ = _appDbContext.ConsumosMensais.Remove(consumoRecente);
                    _ = await _appDbContext.SaveChangesAsync();
                }

                var consumo = new ConsumoMensalModel
                {
                    MesReferencia = req.Periodo.ToDate(),
                    DataMedicao = DateTime.UtcNow,
                    PontoMedicaoId = med.PontoMedicaoId.ToGuid(),
                    Icms = 17
                };

                var res = await _integracaoCceeService.ListarMedicoesPorPonto(ccee);

                if (res.Success)
                {
                    var integracaoCCEE = (IntegracaoCceeDto)res.Data;
                    var listaMedidas = integracaoCCEE.ListaMedidas.OrderBy(o => o.PeriodoFinal).ToList();
                    consumo.StatusMedicao = VerificaStatusMedicao(listaMedidas.Where(m => m.SubTipo.Equals("L") && m.StatusValidoMedicao()), req.Periodo.ToDate(), consumoRecente);

                    if (!integracaoCCEE.ListaMedidas.IsNullOrEmpty())
                    {
                        listaMedidas.ForEach(m => m.Periodo = DateTime.ParseExact(m.PeriodoFinal, "yyyy-MM-ddTHHmmss-0300", null));
                        consumo.Medicoes = _mapper.Map<IEnumerable<MedicoesModel>>(listaMedidas);
                    }
                }
                else
                {
                    consumo.StatusMedicao = EStatusMedicao.ERRO_LEITURA;
                    ret.AddError("LeituraCCEE", "Não foi possível a leitura dos dados junto a CCEE");
                }

                if (consumo.Id.Equals(new Guid()))
                    _ = await _appDbContext.AddAsync(consumo);
                else
                    _ = _appDbContext.Update(consumo);

                _ = await _appDbContext.SaveChangesAsync();

                var resCcee = new IntegracaoCceeDto
                {
                    Periodo = req.Periodo.ToDate(),
                    medicao = new MedicaoDto
                    {
                        StatusMedicao = consumo.StatusMedicao,
                    },
                    ListaMedidas = consumo.Medicoes == null ? new List<IntegracaoCceeMedidasDto>() : consumo.Medicoes.Where(m => m.SubTipo.Equals("L")).Select(m =>
                        new IntegracaoCceeMedidasDto
                        {
                            PontoMedicao = med.PontoMedicao,
                            Periodo = m.Periodo,
                            SubTipo = m.SubTipo,
                            Status = m.Status,
                            ConsumoAtivo = m.ConsumoAtivo,
                            ConsumoReativo = m.ConsumoReativo
                        }
                    )
                };
                if (resCcee.ListaMedidas.Any())
                    resCcee.Totais = new IntegracaoCceeTotaisDto()
                    {
                        MediaConsumoAtivo = resCcee.ListaMedidas.Average(m => m.ConsumoAtivo),
                        MediaConsumoReativo = resCcee.ListaMedidas.Average(m => m.ConsumoReativo),
                        SomaConsumoAtivo = resCcee.ListaMedidas.Sum(m => m.ConsumoAtivo),
                        SomaConsumoReativo = resCcee.ListaMedidas.Sum(m => m.ConsumoReativo)
                    };
                ret.SetData(resCcee);
            }
            return ret.SetOk().SetMessage("Consumos coletados com sucesso.");
        }

        private EStatusMedicao VerificaStatusMedicao(IEnumerable<IntegracaoCceeMedidasDto>? lista, DateTime mesReferencia, ConsumoMensalModel consumoRecente)
        {
            if (!lista.Any())
                return EStatusMedicao.INCOMPLETA;

            if (consumoRecente == null)
                return EStatusMedicao.COMPLETA;

            var totalConsumoRecente = consumoRecente.Medicoes.Where(m => m.SubTipo.Equals("L") && m.StatusValidoMedicao()).Sum(m => m.ConsumoAtivo);
            var totalAtual = lista.Sum(m => m.ConsumoAtivo);

            if (totalConsumoRecente != totalAtual)
                return EStatusMedicao.VALOR_DIVERGENTE;

            int diasNoMes = DateTime.DaysInMonth(mesReferencia.Year, mesReferencia.Month);

            var todasDatas = new List<DateTime>();
            for (int dia = 1; dia <= diasNoMes; dia++)
            {
                for (int hora = 0; hora < 24; hora++)
                {
                    todasDatas.Add(new DateTime(mesReferencia.Year, mesReferencia.Month, dia, hora, 0, 0));
                }
            }

            var listaFiltrada = lista
                .Where(x => DateTime.ParseExact(x.PeriodoFinal, "yyyy-MM-ddTHHmmss-0300", null).Month == mesReferencia.Month &&
                            DateTime.ParseExact(x.PeriodoFinal, "yyyy-MM-ddTHHmmss-0300", null).Year == mesReferencia.Year && x.ConsumoAtivo != 0)
                .ToList();

            foreach (var data in todasDatas)
            {
                if (!listaFiltrada.Any(x => DateTime.ParseExact(x.PeriodoFinal, "yyyy-MM-ddTHHmmss-0300", null).Date == data.Date &&
                                            DateTime.ParseExact(x.PeriodoFinal, "yyyy-MM-ddTHHmmss-0300", null).Hour == data.Hour))
                {
                    return EStatusMedicao.INCOMPLETA;
                }
            }

            return EStatusMedicao.COMPLETA;
        }

        public async Task<Response> ObterAgentes(Guid empresaId)
        {
            var ret = new Response();
            var res = await _appDbContext.AgentesMedicao.Include(a => a.PontosMedicao).Where(a => a.EmpresaId.Equals(empresaId)).ToListAsync();
            if (res == null)
                return ret.SetNotFound().AddError(ETipoErro.INFORMATIVO, $"Não existem agentes para a empresa com o Id {empresaId}.");

            return ret.SetOk().SetData(_mapper.Map<IEnumerable<AgenteMedicaoDto>>(res));
        }

        public async Task<Response> ObterPontos(Guid agenteId)
        {
            var ret = new Response();
            var res = await _appDbContext.PontosMedicao.Where(a => a.AgenteMedicaoId.Equals(agenteId)).ToListAsync();
            if (res == null)
                return ret.SetNotFound().AddError(ETipoErro.INFORMATIVO, $"Não existem pontos de medição para o agente com o Id {agenteId}.");

            return ret.SetOk().SetData(_mapper.Map<IEnumerable<PontoMedicaoDto>>(res));
        }

        public async Task<Response> ObterMedicoes(MedicaoDto req)
        {
            var ret = new Response();

            var res = await _appDbContext.ConsumosMensais.Include(c => c.PontoMedicao).Include(c => c.Medicoes).FirstOrDefaultAsync(c => c.MesReferencia.Equals(req.Periodo) && c.PontoMedicaoId == req.PontoMedicaoId);
            if (res == null)
                return ret.SetNotFound().AddError(ETipoErro.INFORMATIVO, $"Não existe consumo para o ponto de medição {req.PontoMedicao}.");

            var medicoes = _mapper.Map<IEnumerable<IntegracaoCceeMedidasDto>>(res.Medicoes);

            var resCcee = new IntegracaoCceeDto
            {
                PontoMedicao = req.PontoMedicao,
                EmpresaId = req.EmpresaId.ToGuid(),
                Periodo = req.Periodo.ToDate(),
                ListaMedidas = medicoes.Where(m => m.SubTipo.Equals("L")).OrderBy(m => m.PontoMedicao).ThenBy(m => m.PeriodoFinal),
                medicao = new MedicaoDto
                {
                    StatusMedicao = req.StatusMedicao,
                },
            };
            var listaDistinct = medicoes.GroupBy(m => m.Periodo.GetDiaMes()).ToList();
            if (resCcee.ListaMedidas.Any())
            {
                var listaValoresGrafico = new List<ValoresGraficoDto>();
                listaDistinct.ForEach(medida =>
                {
                    listaValoresGrafico.Add(new ValoresGraficoDto()
                    {
                        Dia = medida.Key.Split("-")[0],
                        TotalConsumoHCC = medida.Where(m => m.SubTipo.Equals("L") && m.StatusValidoMedicao()).Sum(m => m.ConsumoAtivo),
                        TotalConsumoHIF = medida.Where(m => m.SubTipo.Equals("L") && m.Status.Equals("HIF")).Sum(m => m.ConsumoAtivo),
                    });
                });
                resCcee.ListaValoresGrafico = listaValoresGrafico;
            }
            if (resCcee.ListaMedidas.Any())
                resCcee.Totais = new IntegracaoCceeTotaisDto()
                {
                    DiasConsumoHCC = resCcee.ListaMedidas.Where(m => m.SubTipo.Equals("L") && m.StatusValidoMedicao()).Select(m => m.Periodo.Day).Distinct().Count(),
                    DiasConsumoHIF = resCcee.ListaMedidas.Where(m => m.SubTipo.Equals("L") && m.Status.Equals("HIF")).Select(m => m.Periodo.Day).Distinct().Count(),
                    TotalConsumoHCC = resCcee.ListaMedidas.Where(m => m.SubTipo.Equals("L") && m.StatusValidoMedicao()).Sum(m => m.ConsumoAtivo),
                    TotalConsumoHIF = resCcee.ListaMedidas.Where(m => m.SubTipo.Equals("L") && m.Status.Equals("HIF")).Sum(m => m.ConsumoAtivo),
                };

            return ret.SetOk().SetData(resCcee).SetMessage("Integração efetuada com sucesso.");
        }

        public async Task<Response> IncluirValores(MedicaoValoresDto req)
        {
            var ret = new Response();
            var res = await _appDbContext.ConsumosMensais.FindAsync(req.Id);
            if (res == null)
                return ret.SetNotFound().AddError(ETipoErro.INFORMATIVO, $"Não existe consumo registrado.");

            res.Icms = req.Icms;
            res.Proinfa = req.Proinfa;

            _appDbContext.Update(res);
            _ = await _appDbContext.SaveChangesAsync();

            return ret.SetOk().SetMessage("Valores alterados com sucesso.");
        }
    }
}
