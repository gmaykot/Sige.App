using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SIGE.Core.Enumerators;
using SIGE.Core.Extensions;
using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Geral.FaturaEnergia;
using SIGE.Core.Models.Dto.Geral.RelatorioEconomia;
using SIGE.Core.Models.Dto.Geral.RelatorioMedicao;
using SIGE.Core.Models.Dto.Gerencial;
using SIGE.Core.Models.Dto.Gerencial.Concessionaria;
using SIGE.Core.Models.Sistema.Geral;
using SIGE.Core.Models.Sistema.Geral.Medicao;
using SIGE.Core.Models.Sistema.Gerencial.BandeiraTarifaria;
using SIGE.Core.SQLFactory;
using SIGE.DataAccess.Context;
using SIGE.Services.Interfaces.Geral;
using System.Globalization;

namespace SIGE.Services.Services.Geral
{
    public class RelatorioEconomiaService(AppDbContext appDbContext, IMapper mapper, IRelatorioMedicaoService relatorioMedicaoService) : IRelatorioEconomiaService
    {
        private readonly AppDbContext _appDbContext = appDbContext;
        private readonly IMapper _mapper = mapper;
        private readonly IRelatorioMedicaoService _relatorioMedicaoService = relatorioMedicaoService;

        public async Task<Response> ListarRelatorios(DateOnly? mesReferencia)
        {
            if (mesReferencia == null)
                mesReferencia = DateOnly.FromDateTime(DateTime.Now).GetPrimeiroDiaMes();
            var ret = new Response();
            var res = await _appDbContext.Database.SqlQueryRaw<RelatorioEconomiaListDto>(RelatorioEconomiaFactory.ListaRelatorios(mesReferencia.Value)).ToListAsync();
            if (res == null || res.Count == 0)
                res = await _appDbContext.Database.SqlQueryRaw<RelatorioEconomiaListDto>(RelatorioEconomiaFactory.ListaRelatorios(mesReferencia.Value.AddMonths(-1))).ToListAsync();

            if (res != null && res.Count != 0)
                return ret.SetOk().SetData(res.DistinctBy(m => (m.DescPontoMedicao, m.MesReferencia)).OrderByDescending(m => (m.MesReferencia, m.DescPontoMedicao)));

            return ret.SetNotFound().AddError(ETipoErro.INFORMATIVO, $"Sem relatório de economia no período.");
        }

        public async Task<Response> ObterFinalPdf(Guid pontoMedicaoId, DateOnly mesReferencia)
        {
            return await this.ObterFinal(pontoMedicaoId, mesReferencia);
        }

        public async Task<Response> ObterFinal(Guid pontoMedicaoId, DateOnly mesReferencia)
        {
            var ret = new Response();
            var res = await _appDbContext.Database.SqlQueryRaw<CabecalhoRelatorioFinalDto>(RelatorioEconomiaFactory.RelatorioFinal(pontoMedicaoId, mesReferencia)).FirstOrDefaultAsync();
            if (res != null)
            {
                var relMedicao = await _relatorioMedicaoService.Obter(res.ContratoId.Value, mesReferencia.GetPrimeiraHoraMes());
                if (relMedicao == null)
                    return ret.SetNotFound().AddError(ETipoErro.INFORMATIVO, $"Sem relatório de medição deve ser emitido.");

                var relMedicoes = relMedicao.Data as RelatorioMedicaoDto;
                var calculo = new CalculoEconomiaService();
                var valores = calculo.Calcular(relMedicoes);

                var fatura = _mapper.Map<FaturaEnergiaDto>(await _appDbContext.FaturasEnergia.Include(f => f.LancamentosAdicionais).FirstOrDefaultAsync(f => f.PontoMedicaoId == pontoMedicaoId && f.MesReferencia == mesReferencia));
                if (fatura != null)
                {
                    var tarifa = _mapper.Map<TarifaAplicacaoDto>(await _appDbContext.TarifasAplicacao.Where(t => t.ConcessionariaId == fatura.ConcessionariaId && t.Segmento == res.Segmento).OrderByDescending(t => t.DataUltimoReajuste).FirstOrDefaultAsync());
                    if (tarifa != null)
                    {
                        var tarifaCalculada = _mapper.Map<TarifaCalculadaDto>(tarifa);
                        var consumo = await _appDbContext.ConsumosMensais.FirstOrDefaultAsync(c => c.PontoMedicaoId == pontoMedicaoId && c.MesReferencia == mesReferencia);
                        if (consumo != null)
                        {
                            var faturamento = await _appDbContext.FaturamentosCoenel.OrderByDescending(f => f.VigenciaInicial).FirstOrDefaultAsync(f => f.PontoMedicaoId == pontoMedicaoId);
                            var imposto = _mapper.Map<ImpostoConcessionariaDto>(await _appDbContext.ImpostosConcessionarias.FirstOrDefaultAsync(i => i.ConcessionariaId == fatura.ConcessionariaId && i.MesReferencia == fatura.MesReferencia));
                            var salarioMinimo = await _appDbContext.SalariosMinimos.OrderByDescending(s => s.VigenciaInicial).FirstOrDefaultAsync();
                            var energiaAcumulada = await _appDbContext.EnergiasAcumuladas.OrderByDescending(e => e.MesReferencia).FirstOrDefaultAsync(e => e.PontoMedicaoId == pontoMedicaoId);
                            var bandeiraVigente = await _appDbContext.BandeiraTarifariaVigente.Include(b => b.BandeiraTarifaria).OrderByDescending(b => b.MesReferencia).FirstOrDefaultAsync(b => DateOnly.FromDateTime(b.MesReferencia) == fatura.MesReferencia);
                            
                            tarifaCalculada.ICMS = consumo.Icms;
                            tarifaCalculada.Cofins = imposto.ValorCofins;
                            tarifaCalculada.Proinfa = consumo.Proinfa;
                            tarifaCalculada.PIS = imposto.ValorPis;
                            tarifaCalculada.BandeiraAdicional = bandeiraVigente.ValorBandeira();
                            tarifaCalculada.TotalPercentualTUSD = 50;
                            tarifaCalculada.PercentualTUSD = fatura.ValorDescontoTUSD;

                            res.TarifaFornecimento = $"Tarifa Fornecimento - Resolução ANEEL nº {tarifa.NumeroResolucao}, {tarifa.DataUltimoReajuste.ToString("d", new CultureInfo("pt-BR"))}";
                            var relatorio = new RelatorioFinalDto
                            {                                
                                Cabecalho = res,
                                Grupos = [GrupoCativoMapper(0, fatura, consumo, tarifaCalculada), GrupoLivreMapper(1, fatura, consumo, tarifaCalculada, relMedicoes, valores)],
                            };
                            relatorio.Comparativo = CompartivoFinal(relatorio, faturamento, salarioMinimo?.Valor, energiaAcumulada?.ValorTotalAcumulado);                            
                            return ret.SetOk().SetData(relatorio);
                        }
                    }
                }
            }
            
            return ret.SetNotFound().AddError(ETipoErro.INFORMATIVO, $"Sem relatório de economia no período.");
        }

        private ComparativoRelatorioFinalDto CompartivoFinal(RelatorioFinalDto relatorio, FaturamentoCoenelModel faturamento, double? valorSalarioMinimo, double? totalAcumulado)
        {
            if (faturamento == null)
                return new ComparativoRelatorioFinalDto { Observacao = "ATENÇÃO! Cadastre o faturamento em Menu > Geral > Faturamento Coenel" };

            var totalCativo = relatorio.Grupos.ElementAt(0).SubGrupos?.ElementAt(0)?.Total?.Total;
            var totalLivre = relatorio.Grupos.ElementAt(1).SubGrupos?.ElementAt(0)?.Total?.Total;
            var totalEconomia = totalCativo - totalLivre;
            var lancamentoCoenel = LancamentoCoenel(faturamento, totalEconomia, valorSalarioMinimo);
            
            relatorio.Grafico = new GraficoRelatorioFinalDto { Titulo = "GRÁFICO ECONOMIA NO MÊS" };
            relatorio.Grafico.Linhas.Add(new LinhaGraficoFinalDto { Label = "Mercado Cativo", Valor = totalCativo });
            relatorio.Grafico.Linhas.Add(new LinhaGraficoFinalDto { Label = "Mercado Livre", Valor = totalLivre });
            relatorio.Grafico.Linhas.Add(new LinhaGraficoFinalDto { Label = "Economia", Valor = totalEconomia });
            relatorio.Grafico.Linhas = relatorio.Grafico.Linhas
                .OrderBy(l => l.Valor)
                .ToList();
            var ret = new ComparativoRelatorioFinalDto
            {
                Titulo = "Comparativo – Mercado Cativo vs. Mercado Livre",
                Observacao = "Observação: Todos os valores contemplam PIS/COFINS e ICMS",
                Lancamentos = [
                    new LancamentoComparativoDto {
                        Descricao = "Diferença Cativo vs. Livre",
                        Percentual = (totalEconomia/totalCativo)*100,
                        Valor = totalEconomia,
                        Observacao = "Economia total bruta"
                    },
                    lancamentoCoenel,
                    new LancamentoComparativoDto {
                        Descricao = "Economia mensal líquida",
                        Percentual = ((totalEconomia-lancamentoCoenel.Valor)/totalCativo)*100,
                        Valor = totalEconomia-lancamentoCoenel.Valor,
                        Observacao = "Após desconto Coenel-DE",
                        SubTotal = true
                    },
                    new LancamentoComparativoDto {
                        Descricao = "Economia acumulada",
                        Valor = totalAcumulado+totalEconomia,
                        Total = true
                    },
                ]
            };

            return ret;
        }

        private LancamentoComparativoDto LancamentoCoenel(FaturamentoCoenelModel faturamento, double? totalEconomia, double? valorSalarioMinimo)
        {
            if (faturamento == null)
                return new LancamentoComparativoDto();

            double? totalDevido = totalEconomia ?? 0;

            if (faturamento?.Porcentagem != null && faturamento.Porcentagem > 0)
                totalDevido = totalDevido * (faturamento?.Porcentagem / 100);

            if (faturamento?.ValorFixo != null && faturamento.ValorFixo > 0)
                totalDevido = totalDevido + faturamento?.ValorFixo;

            if (faturamento?.QtdeSalarios != null && faturamento.QtdeSalarios > 0)
                totalDevido = totalDevido + (faturamento?.QtdeSalarios + valorSalarioMinimo);

            return new LancamentoComparativoDto
            {
                Descricao = "Valor devido à Coenel-DE",
                Valor = totalDevido,
                Observacao = faturamento.ToString()
            };
        }

        private GrupoRelatorioFinalDto GrupoCativoMapper(int ordem, FaturaEnergiaDto fatura, ConsumoMensalModel consumo, TarifaCalculadaDto tarifaCalculada)
        {
            var grupo = new GrupoRelatorioFinalDto
            {
                Ordem = ordem,
                Titulo = "MERCADO CATIVO - A4 - TOTAL",
                ColunaQuantidade = "Montante",
                ColunaValor = "Tarifa",
                ColunaTotal = "Total",
                SubGrupos = [
                            new SubGrupoRelatorioFinalDto {
                                Lancamentos = [
                                    new LancamentoRelatorioFinalDto {
                                        Descricao = "Demanda Contratada - Ponta",
                                        Montante = fatura.ValorDemandaContratadaPonta,
                                        TipoMontante = ETipoMontante.KW,
                                        TipoTarifa = ETipoTarifa.RS_KW
                                    },
                                    new LancamentoRelatorioFinalDto {
                                        Descricao = "Demanda Contratada - Fora de Ponta",
                                        Montante = fatura.ValorDemandaContratadaForaPonta,
                                        TipoMontante = ETipoMontante.KW,
                                        TipoTarifa = ETipoTarifa.RS_KW
                                    },
                                    new LancamentoRelatorioFinalDto {
                                        Descricao = "Demanda Faturada - Ponta (Consumida)",
                                        Montante = fatura.ValorDemandaFaturadaPontaConsumida,
                                        TipoMontante = ETipoMontante.KW,
                                        Tarifa = tarifaCalculada.KWPontaComImposto,
                                        TipoTarifa = ETipoTarifa.RS_KW
                                    },
                                    new LancamentoRelatorioFinalDto {
                                        Descricao = "Demanda Faturada - Fora de Ponta (Consumida)",
                                        Montante = fatura.ValorDemandaFaturadaForaPontaConsumida,
                                        TipoMontante = ETipoMontante.KW,
                                        Tarifa = tarifaCalculada.KWForaPontaComImposto,
                                        TipoTarifa = ETipoTarifa.RS_KW
                                    },
                                    new LancamentoRelatorioFinalDto {
                                        Descricao = "Demanda Faturada - Ponta (Não Utilizada)",
                                        Montante = fatura.ValorDemandaFaturadaPontaNaoConsumida,
                                        TipoMontante = ETipoMontante.KW,
                                        Tarifa = tarifaCalculada.KWPontaSemICMS,
                                        TipoTarifa = ETipoTarifa.RS_KW
                                    },
                                    new LancamentoRelatorioFinalDto {
                                        Descricao = "Demanda Faturada - Fora de Ponta (Não Utilizada)",
                                        Montante = fatura.ValorDemandaFaturadaForaPontaNaoConsumida,
                                        TipoMontante = ETipoMontante.KW,
                                        Tarifa = tarifaCalculada.KWForaPontaSemICMS,
                                        TipoTarifa = ETipoTarifa.RS_KW
                                    },
                                    new LancamentoRelatorioFinalDto {
                                        Descricao = "Demanda Ultrapassagem - Ponta",
                                        Montante = fatura.ValorDemandaUltrapassagemPonta,
                                        TipoMontante = ETipoMontante.KW,
                                        Tarifa = tarifaCalculada.KWPontaComImposto*2,
                                        TipoTarifa = ETipoTarifa.RS_KW
                                    },
                                    new LancamentoRelatorioFinalDto {
                                        Descricao = "Demanda Ultrapassagem - Fora de Ponta",
                                        Montante = fatura.ValorDemandaUltrapassagemForaPonta,
                                        TipoMontante = ETipoMontante.KW,
                                        Tarifa = tarifaCalculada.KWForaPontaComImposto*2,
                                        TipoTarifa = ETipoTarifa.RS_KW
                                    },
                                    new LancamentoRelatorioFinalDto {
                                        Descricao = "Demanda Reativa - Ponta",
                                        Montante = fatura.ValorDemandaReativaPonta,
                                        Tarifa = 65.41866801,
                                        TipoTarifa = ETipoTarifa.RS_KW
                                    },
                                    new LancamentoRelatorioFinalDto {
                                        Descricao = "Demanda Reativa - Fora de Ponta",
                                        Montante = fatura.ValorDemandaReativaForaPonta,
                                        Tarifa = 65.41866801,
                                        TipoTarifa = ETipoTarifa.RS_KW
                                    },
                                    new LancamentoRelatorioFinalDto {
                                        Descricao = "Consumo Medido - Ponta - TUSD",
                                        Montante = fatura.ValorConsumoTUSDPonta,
                                        TipoMontante = ETipoMontante.KW,
                                        Tarifa = tarifaCalculada.KWhPontaTUSDComImposto,
                                        TipoTarifa = ETipoTarifa.RS_KWH
                                    },
                                    new LancamentoRelatorioFinalDto {
                                        Descricao = "Consumo Medido - Fora de Ponta - TUSD",
                                        Montante = fatura.ValorConsumoTUSDForaPonta,
                                        TipoMontante = ETipoMontante.KW,
                                        Tarifa = tarifaCalculada.KWhForaPontaTUSDComImposto,
                                        TipoTarifa = ETipoTarifa.RS_KWH
                                    },
                                    new LancamentoRelatorioFinalDto {
                                        Descricao = "Consumo Medido - Ponta - TE",
                                        Montante = fatura.ValorConsumoTEPonta,
                                        TipoMontante = ETipoMontante.KW,
                                        Tarifa = tarifaCalculada.KWhPontaTEComImposto,
                                        TipoTarifa = ETipoTarifa.RS_KWH
                                    },
                                    new LancamentoRelatorioFinalDto {
                                        Descricao = "Consumo Medido - Fora de Ponta - TE",
                                        Montante = fatura.ValorConsumoTEForaPonta,
                                        TipoMontante = ETipoMontante.KW,
                                        Tarifa = tarifaCalculada.KWhForaPontaTEComImposto,
                                        TipoTarifa = ETipoTarifa.RS_KWH
                                    },
                                    new LancamentoRelatorioFinalDto {
                                        Descricao = "Adicional Bandeira Ponta",
                                        Tarifa = tarifaCalculada.BandeiraAdicionalComImposto,
                                        TipoTarifa = ETipoTarifa.RS_KWH,
                                        Total = fatura.ValorConsumoTEPonta*tarifaCalculada.BandeiraAdicionalComImposto
                                    },
                                    new LancamentoRelatorioFinalDto {
                                        Descricao = "Adicional Bandeira Fora de Ponta",
                                        Tarifa = tarifaCalculada.BandeiraAdicionalComImposto,
                                        TipoTarifa = ETipoTarifa.RS_KWH,
                                        Total = fatura.ValorConsumoTEForaPonta*tarifaCalculada.BandeiraAdicionalComImposto
                                    },
                                    new LancamentoRelatorioFinalDto {
                                        Descricao = "Consumo Medido Reativo - Ponta",
                                        Montante = fatura.ValorConsumoMedidoReativoPonta,
                                        TipoMontante = ETipoMontante.KW,
                                        Tarifa = fatura.TarifaMedidaReativaPonta,
                                        TipoTarifa = ETipoTarifa.RS_KWH
                                    },
                                    new LancamentoRelatorioFinalDto {
                                        Descricao = "Consumo Medido Reativo - Fora de Ponta",
                                        Montante = fatura.ValorConsumoMedidoReativoForaPonta,
                                        TipoMontante = ETipoMontante.KW,
                                        Tarifa =  fatura.TarifaMedidaReativaForaPonta,
                                        TipoTarifa = ETipoTarifa.RS_KWH
                                    },
                                ],
                                Total = new LancamentoRelatorioFinalDto {
                                    Descricao = "Total geral Mercado Cativo (impostos inclusos)",
                                    TipoMontante = ETipoMontante.KWH,
                                    TipoTarifa = ETipoTarifa.RS_KWH,
                                }
                            }
                        ]
            };

            foreach (var sg in grupo.SubGrupos)
            {
                foreach (var lc in sg.Lancamentos.Where(v => v.Total == 0))
                {
                    lc.Total = (lc.Montante ?? 0) * (lc.Tarifa ?? 0);
                }

                sg.Total.Total = sg.Lancamentos?.Sum(l => l.Total) ?? 0;
            }

            return grupo;
        }

        private GrupoRelatorioFinalDto GrupoLivreMapper(int ordem, FaturaEnergiaDto fatura, ConsumoMensalModel consumo, TarifaCalculadaDto tarifaCalculada, RelatorioMedicaoDto relMedicoes, ValoresCaltuloMedicaoDto valores)
        {
            var listaFinal = new List<LancamentoRelatorioFinalDto>();
            var parte1 = LancMercadoLivreParte1(fatura, consumo, tarifaCalculada, relMedicoes, valores);
            var parte2 = LancMercadoLivreParte2(fatura, consumo, tarifaCalculada, relMedicoes, valores);
            var parte3 = LancMercadoLivreParte3(fatura);
            var parte4 = LancMercadoLivreParte4(fatura);
            var parte5 = LancMercadoLivreParte5(fatura);
            listaFinal.AddRange(parte1);
            listaFinal.Add(new LancamentoRelatorioFinalDto
            {
                Descricao = "Sub-total de compra de energia elétrica",
                Total = parte1.Where(p => p.TipoMontante != ETipoMontante.Percentual).Sum(p => p.Total),
                Totalizador = true
            });
            listaFinal.AddRange(parte2);
            listaFinal.Add(new LancamentoRelatorioFinalDto
            {
                Descricao = "Sub-total para base de cálculo imposto ICMS/PIS/COFINS",
                Total = parte2.Where(p => p.TipoMontante != ETipoMontante.Percentual).Sum(p => p.Total),
                Totalizador = true
            });
            listaFinal.AddRange(parte3);
            listaFinal.Add(new LancamentoRelatorioFinalDto
            {
                Descricao = "Total distribuidora",
                Total = parte2.Where(p => p.TipoMontante != ETipoMontante.Percentual).Sum(p => p.Total) + parte3.Where(p => p.TipoMontante != ETipoMontante.Percentual).Sum(p => p.Total),
                Totalizador = true
            });
            listaFinal.AddRange(parte4);
            listaFinal.Add(new LancamentoRelatorioFinalDto
            {
                Descricao = "Sub-total de valores referente a Distribuidora",
                Total = parte4.Where(p => p.TipoMontante != ETipoMontante.Percentual).Sum(p => p.Total) + 
                        parte3.Where(p => p.TipoMontante != ETipoMontante.Percentual).Sum(p => p.Total) + 
                        parte2.Where(p => p.TipoMontante != ETipoMontante.Percentual).Sum(p => p.Total),
                Totalizador = true
            });
            listaFinal.AddRange(parte5);
            listaFinal.Add(new LancamentoRelatorioFinalDto
            {
                Descricao = "Sub-total dos outros custos Mercado Livre",
                Total = parte5.Where(p => p.TipoMontante != ETipoMontante.Percentual).Sum(p => p.Total),
                Totalizador = true
            });

            var grupo = new GrupoRelatorioFinalDto
            {
                Ordem = ordem,
                Titulo = "MERCADO LIVRE - A4",
                ColunaQuantidade = "Montante",
                ColunaValor = "Tarifa",
                ColunaTotal = "Total",
                SubGrupos = [
                            new SubGrupoRelatorioFinalDto {
                                Lancamentos = listaFinal,
                                Total = new LancamentoRelatorioFinalDto {
                                    Descricao = "Total geral Mercado Livre",
                                    TipoMontante = ETipoMontante.KWH,
                                    TipoTarifa = ETipoTarifa.RS_KWH,
                                    Total = parte1.Where(p => p.TipoMontante != ETipoMontante.Percentual).Sum(p => p.Total) +
                                            parte2.Where(p => p.TipoMontante != ETipoMontante.Percentual).Sum(p => p.Total) +
                                            parte3.Where(p => p.TipoMontante != ETipoMontante.Percentual).Sum(p => p.Total) +
                                            parte5.Where(p => p.TipoMontante != ETipoMontante.Percentual).Sum(p => p.Total)
                                }
                            }
                        ]
            };

            return grupo;
        }

        private IList<LancamentoRelatorioFinalDto> LancMercadoLivreParte1(FaturaEnergiaDto fatura, ConsumoMensalModel consumo, TarifaCalculadaDto tarifaCalculada, RelatorioMedicaoDto relMedicoes, ValoresCaltuloMedicaoDto valores)
        {
            List<LancamentoRelatorioFinalDto> parte1 = 
                [
                    new LancamentoRelatorioFinalDto {
                        Descricao = "Perdas Reais",
                        Montante = (double)valores.ValorPerdasReais,
                        TipoMontante = ETipoMontante.Percentual
                    },
                    new LancamentoRelatorioFinalDto {
                        Descricao = "Consumo de energia considerando perdas e PROINFA",
                        Montante = (double)valores.ValorPerdas,
                        TipoMontante = ETipoMontante.MWH,
                    },
                    new LancamentoRelatorioFinalDto {
                        Descricao = "PROINFA",
                        Montante = consumo.Proinfa,
                        TipoMontante = ETipoMontante.MWH,
                    },
                    new LancamentoRelatorioFinalDto {
                        Descricao = "Consumo de energia - Longo Prazo",
                        Montante = (double)valores.ResultadoFaturamento.Quantidade,
                        TipoMontante = ETipoMontante.MWH,
                        Tarifa = (double)valores.ResultadoFaturamento.ValorUnitario,
                        Total = (double)valores.ResultadoFaturamento.ValorNota,
                        TipoTarifa = ETipoTarifa.RS_MWH
                    },
                    new LancamentoRelatorioFinalDto {
                        Descricao = "Venda de energia - Curto Prazo",
                        TipoMontante = ETipoMontante.KW,
                        Tarifa = tarifaCalculada.KWPontaSemICMS,
                        TipoTarifa = ETipoTarifa.RS_KW
                    },
                    new LancamentoRelatorioFinalDto {
                        Descricao = "Desconto TUSD (RETUSD)",
                        Montante = fatura.ValorDemandaFaturadaForaPontaNaoConsumida,
                        TipoMontante = ETipoMontante.KW,
                        Tarifa = tarifaCalculada.KWForaPontaSemICMS,
                        TipoTarifa = ETipoTarifa.RS_KW
                    },
            ];

            return parte1;
        }

        private IList<LancamentoRelatorioFinalDto> LancMercadoLivreParte2(FaturaEnergiaDto fatura, ConsumoMensalModel consumo, TarifaCalculadaDto tarifaCalculada, RelatorioMedicaoDto relMedicoes, ValoresCaltuloMedicaoDto valores)
        {
            List<LancamentoRelatorioFinalDto> parte2 =
                [
                    new LancamentoRelatorioFinalDto {
                        Descricao = "TUSD - Ponta",
                        Montante = fatura.ValorDemandaFaturadaPontaConsumida,
                        TipoMontante = ETipoMontante.KW,
                        Tarifa = tarifaCalculada.KWPontaComImposto,
                        TipoTarifa = ETipoTarifa.RS_KW
                    },
                    new LancamentoRelatorioFinalDto {
                        Descricao = "TUSD - Fora de Ponta",
                        Montante = fatura.ValorDemandaFaturadaForaPontaConsumida,
                        TipoMontante = ETipoMontante.KW,
                        Tarifa = tarifaCalculada.KWhForaPontaTUSDCalculadoComImposto,
                        TipoTarifa = ETipoTarifa.RS_KW
                    },
                    new LancamentoRelatorioFinalDto {
                        Descricao = "TUSD - Ultrapassagem Fora de Ponta",
                        Montante = fatura.ValorDemandaUltrapassagemForaPonta,
                        TipoMontante = ETipoMontante.KW,
                        Tarifa = tarifaCalculada.KWForaPontaComImposto*2,
                        TipoTarifa = ETipoTarifa.RS_KW
                    },
                    new LancamentoRelatorioFinalDto {
                        Descricao = "TUSD encargos - Ponta",
                        Montante = fatura.ValorConsumoTUSDPonta,
                        TipoMontante = ETipoMontante.KW,
                        Tarifa =   tarifaCalculada.KWhPontaTUSDComImposto,
                        TipoTarifa = ETipoTarifa.RS_KW
                    },
                    new LancamentoRelatorioFinalDto {
                        Descricao = "TUSD encargos - Fora de Ponta",
                        Montante = fatura.ValorConsumoTUSDForaPonta,
                        TipoMontante = ETipoMontante.KW,
                        Tarifa =  tarifaCalculada.KWhForaPontaTUSDComImposto,
                        TipoTarifa = ETipoTarifa.RS_KW
                    },
                    new LancamentoRelatorioFinalDto {
                        Descricao = "Consumo Reativo - Ponta",
                        Montante = fatura.ValorConsumoMedidoReativoPonta,
                        TipoMontante = ETipoMontante.KW,
                        Tarifa =  fatura.TarifaMedidaReativaPonta,
                        TipoTarifa = ETipoTarifa.RS_KW
                    },
                    new LancamentoRelatorioFinalDto {
                        Descricao = "Consumo Reativo - Fora de Ponta",
                        Montante = fatura.ValorConsumoMedidoReativoForaPonta,
                        TipoMontante = ETipoMontante.KW,
                        Tarifa =  fatura.TarifaMedidaReativaForaPonta,
                        TipoTarifa = ETipoTarifa.RS_KW
                    }
            ];

            return parte2;
        }

        private IList<LancamentoRelatorioFinalDto> LancMercadoLivreParte3(FaturaEnergiaDto fatura)
        {
            List<LancamentoRelatorioFinalDto> ret = [];

            foreach (var lanc in fatura.LancamentosAdicionais.Where(l => l.ContabilizaFatura == false))
            {
                ret.Add(new LancamentoRelatorioFinalDto
                {
                    Descricao = lanc.Descricao,
                    Total = lanc.Tipo.Equals(ETipoLancamento.DEBITO) ? lanc.Valor : lanc.Valor * -1
                });
            }

            return ret;
        }

        private IList<LancamentoRelatorioFinalDto> LancMercadoLivreParte4(FaturaEnergiaDto fatura)
        {
            List<LancamentoRelatorioFinalDto> ret = [];

            foreach (var lanc in fatura.LancamentosAdicionais.Where(l => l.ContabilizaFatura == true && l.TipoCCEE == false))
            {
                ret.Add(new LancamentoRelatorioFinalDto
                {
                    Descricao = lanc.Descricao,
                    Total = lanc.Tipo.Equals(ETipoLancamento.DEBITO) ? lanc.Valor : lanc.Valor * -1
                });
            }

            return ret;
        }

        private IList<LancamentoRelatorioFinalDto> LancMercadoLivreParte5(FaturaEnergiaDto fatura)
        {
            List<LancamentoRelatorioFinalDto> ret = [];

            foreach (var lanc in fatura.LancamentosAdicionais.Where(l => l.ContabilizaFatura == true && l.TipoCCEE == true))
            {
                ret.Add(new LancamentoRelatorioFinalDto
                {
                    Descricao = lanc.Descricao,
                    Total = lanc.Tipo.Equals(ETipoLancamento.DEBITO) ? lanc.Valor : lanc.Valor * -1
                });
            }

            return ret;
        }
    }
}
