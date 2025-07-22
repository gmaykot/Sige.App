using System.Globalization;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using MySqlConnector;
using SIGE.Core.Enumerators;
using SIGE.Core.Extensions;
using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Geral.FaturaEnergia;
using SIGE.Core.Models.Dto.Geral.RelatorioEconomia;
using SIGE.Core.Models.Dto.Geral.RelatorioMedicao;
using SIGE.Core.Models.Dto.Gerencial;
using SIGE.Core.SQLFactory;
using SIGE.DataAccess.Context;
using SIGE.Services.Interfaces.Geral;

namespace SIGE.Services.Services.Geral {
    public class RelatorioEconomiaService(AppDbContext appDbContext, IMapper mapper, IRelatorioMedicaoService relatorioMedicaoService) : IRelatorioEconomiaService {
        private readonly AppDbContext _appDbContext = appDbContext;
        private readonly IMapper _mapper = mapper;
        private readonly IRelatorioMedicaoService _relatorioMedicaoService = relatorioMedicaoService;

        public async Task<Response> ListarRelatorios(DateOnly? mesReferencia) {
            if (mesReferencia == null)
                mesReferencia = DateOnly.FromDateTime(DateTime.Now).GetPrimeiroDiaMes();
            var ret = new Response();
            var res = await _appDbContext.Database.SqlQueryRaw<RelatorioEconomiaListDto>(RelatorioEconomiaFactory.ListaRelatorios(mesReferencia.Value)).ToListAsync();
            if (res != null && res.Count != 0)
                return ret.SetOk().SetData(res.DistinctBy(m => (m.DescPontoMedicao, m.MesReferencia)).OrderByDescending(m => (m.MesReferencia, m.DescPontoMedicao)));

            return ret.SetNotFound().AddError(ETipoErro.INFORMATIVO, $"Sem relatório de economia no período.");
        }

        public async Task<Response> ObterFinalPdf(Guid pontoMedicaoId, DateOnly mesReferencia) {
            return await this.ObterFinal(pontoMedicaoId, mesReferencia);
        }

        public async Task<Response> ObterFinal(Guid pontoMedicaoId, DateOnly mesReferencia) {
            var ret = new Response();
            var res = await _appDbContext.Database.SqlQueryRaw<CabecalhoRelatorioFinalDto>(RelatorioEconomiaFactory.RelatorioFinal(pontoMedicaoId, mesReferencia)).FirstOrDefaultAsync();
            if (res != null) {
                res.MesReferencia = mesReferencia.ToString("MM/yyyy");
                var relMedicao = await _relatorioMedicaoService.Obter(res.ContratoId.Value, mesReferencia.GetPrimeiraHoraMes());
                if (relMedicao == null)
                    return ret.SetNotFound().AddError(ETipoErro.INFORMATIVO, $"Sem relatório de medição deve ser emitido.");

                var relMedicoes = relMedicao.Data as RelatorioMedicaoDto;
                var calculo = new CalculoEconomiaService();
                var valores = calculo.Calcular(relMedicoes);
                var valorAnalitico = calculo.CalcularAnalitico(relMedicoes).Where(c => c.NumCnpj == res.CNPJ).FirstOrDefault();

                var fatura = _mapper.Map<FaturaEnergiaDto>(await _appDbContext.FaturasEnergia.AsNoTracking().Include(f => f.LancamentosAdicionais).FirstOrDefaultAsync(f => f.PontoMedicaoId == pontoMedicaoId && f.MesReferencia == mesReferencia));
                if (fatura == null)
                    ret.AddError(ETipoErro.INFORMATIVO, "Fatura de Energia não encontrada.");

                var ultimoDiaMes = DateTime.DaysInMonth(mesReferencia.Year, mesReferencia.Month);
                var dataReferencia = new DateTime(mesReferencia.Year, mesReferencia.Month, ultimoDiaMes);
                var tarifa = _mapper.Map<TarifaAplicacaoDto>(
                    await _appDbContext.TarifasAplicacao
                        .AsNoTracking()
                        .IgnoreAutoIncludes()
                        .Where(t => t.ConcessionariaId == fatura.ConcessionariaId
                            && t.Segmento == res.Segmento
                            && t.SubGrupo == res.Conexao
                            && t.Ativo
                            && t.DataUltimoReajuste <= dataReferencia)
                        .OrderByDescending(t => t.DataUltimoReajuste)
                        .FirstOrDefaultAsync());

                if (tarifa == null)
                    ret.AddError(ETipoErro.INFORMATIVO, "Tarifa de Aplicação não encontrada.");

                var tarifaCalculada = _mapper.Map<TarifaCalculadaDto>(tarifa);

                var parameters = new MySqlParameter[]
                    {
                        new("@MesReferencia", MySqlDbType.Date) { Value = fatura.MesReferencia },
                        new("@PontoMedicaoId", MySqlDbType.Guid) { Value = fatura.PontoMedicaoId },
                        new("@ConcessionariaId", MySqlDbType.Guid) { Value = fatura.ConcessionariaId },
                    };

                var paramRelatorio = await _appDbContext.Database.SqlQueryRaw<ParametrosRelatorioEconomiaDto>(RelatorioEconomiaFactory.ObterParametrosRelatorioEconomia(), parameters).FirstOrDefaultAsync();

                // Verificações por tabela:
                if (paramRelatorio == null || paramRelatorio?.FaturamentoId == null)
                    return ret.SetBadRequest().AddError(ETipoErro.INFORMATIVO, "Dados de Faturamento Coenel não encontrados.");

                if (paramRelatorio?.ImpostoId == null)
                    ret.AddError(ETipoErro.INFORMATIVO, "Dados de Impostos não encontrados.");

                if (paramRelatorio?.SalarioMinimoId == null)
                    ret.AddError(ETipoErro.INFORMATIVO, "Dados de Salário Mínimo não encontrados.");

                if (paramRelatorio?.BandeiraVigenteId == null)
                    ret.AddError(ETipoErro.INFORMATIVO, "Dados de Bandeira Tarifária Vigente não encontrados.");

                if (paramRelatorio?.ConsumoId == null)
                    ret.AddError(ETipoErro.INFORMATIVO, "Dados de Consumo Mensal não encontrados.");

                if (ret.Errors.Count() > 0)
                    return ret.SetBadRequest();

                if (paramRelatorio?.EnergiaAcumuladaId == null)
                    ret.AddError(ETipoErro.INFORMATIVO, "Dados de Energia Acumulada não encontrados.");

                tarifaCalculada.ICMS = paramRelatorio.Icms;
                tarifaCalculada.Cofins = paramRelatorio.ValorCofins;
                tarifaCalculada.Proinfa = paramRelatorio.Proinfa;
                tarifaCalculada.PIS = paramRelatorio.ValorPis;
                tarifaCalculada.BandeiraAdicional = paramRelatorio.ValorBandeiraAplicado;
                tarifaCalculada.TotalPercentualTUSD = relMedicoes.TipoEnergia.GetValorTipoEnergia();
                tarifaCalculada.PercentualTUSD = fatura.ValorDescontoTUSD;

                res.TarifaFornecimento = $"Tarifa Fornecimento - Resolução ANEEL nº {tarifa.NumeroResolucao}, {tarifa.DataUltimoReajuste?.ToString("d", new CultureInfo("pt-BR"))}";
                var relatorio = new RelatorioFinalDto {
                    Cabecalho = res,
                    Grupos = [GrupoCativoMapper(0, fatura, tarifaCalculada, res.Conexao), GrupoLivreMapper(1, fatura, tarifaCalculada, relMedicoes, valores, res.Conexao, valorAnalitico, paramRelatorio)],
                };
                relatorio.Comparativo = CompartivoFinal(relatorio, paramRelatorio, paramRelatorio?.SalarioMinimoValor, paramRelatorio?.ValorTotalAcumulado);
                return ret.SetOk().SetData(relatorio);
            }

            return ret.SetNotFound().AddError(ETipoErro.INFORMATIVO, $"Sem relatório de economia no período.");
        }

        private ComparativoRelatorioFinalDto CompartivoFinal(RelatorioFinalDto relatorio, ParametrosRelatorioEconomiaDto paramRelatorio, double? valorSalarioMinimo, double? totalAcumulado) {
            if (paramRelatorio == null)
                return new ComparativoRelatorioFinalDto { Observacao = "ATENÇÃO! Cadastre o faturamento em Menu > Geral > Faturamento Coenel" };

            var totalCativo = relatorio.Grupos.ElementAt(0).SubGrupos?.ElementAt(0)?.Total?.Total;
            var totalLivre = relatorio.Grupos.ElementAt(1).SubGrupos?.ElementAt(0)?.Total?.Total;
            var totalEconomia = totalCativo - totalLivre;
            var lancamentoCoenel = LancamentoCoenel(paramRelatorio, totalEconomia, valorSalarioMinimo);

            relatorio.Grafico = new GraficoRelatorioFinalDto { Titulo = "GRÁFICO ECONOMIA NO MÊS" };
            relatorio.Grafico.Linhas.Add(new LinhaGraficoFinalDto { Label = "Mercado Cativo", Valor = totalCativo });
            relatorio.Grafico.Linhas.Add(new LinhaGraficoFinalDto { Label = "Mercado Livre", Valor = totalLivre });
            relatorio.Grafico.Linhas.Add(new LinhaGraficoFinalDto { Label = "Economia", Valor = totalEconomia });
            relatorio.Grafico.Linhas = relatorio.Grafico.Linhas
                .OrderBy(l => l.Valor)
                .ToList();
            var ret = new ComparativoRelatorioFinalDto {
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

        private LancamentoComparativoDto LancamentoCoenel(ParametrosRelatorioEconomiaDto paramRelatorio, double? totalEconomia, double? valorSalarioMinimo) {
            if (paramRelatorio == null)
                return new LancamentoComparativoDto();

            double? totalDevido = 0;

            if (paramRelatorio?.Porcentagem != null && paramRelatorio.Porcentagem > 0)
                totalDevido += totalEconomia * (paramRelatorio?.Porcentagem / 100);

            if (paramRelatorio?.ValorFixo != null && paramRelatorio.ValorFixo > 0)
                totalDevido += paramRelatorio?.ValorFixo;

            if (paramRelatorio?.QtdeSalarios != null && paramRelatorio.QtdeSalarios > 0)
                totalDevido += paramRelatorio?.QtdeSalarios * valorSalarioMinimo;

            return new LancamentoComparativoDto {
                Descricao = "Valor devido à Coenel-DE",
                Valor = totalDevido,
                Observacao = paramRelatorio.ToString()
            };
        }

        private GrupoRelatorioFinalDto GrupoCativoMapper(int ordem, FaturaEnergiaDto fatura, TarifaCalculadaDto tarifaCalculada, ETipoConexao conexao) {
            var grupo = new GrupoRelatorioFinalDto {
                Ordem = ordem,
                Titulo = $"MERCADO CATIVO - {conexao.GetSigla()} - TOTAL",
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

            foreach (var sg in grupo.SubGrupos) {
                foreach (var lc in sg.Lancamentos.Where(v => v.Total == 0)) {
                    lc.Total = (lc.Montante ?? 0) * (lc.Tarifa ?? 0);
                }

                sg.Total.Total = sg.Lancamentos?.Sum(l => l.Total) ?? 0;
            }

            return grupo;
        }

        private GrupoRelatorioFinalDto GrupoLivreMapper(int ordem, FaturaEnergiaDto fatura, TarifaCalculadaDto tarifaCalculada, RelatorioMedicaoDto relMedicoes, ValoresCaltuloMedicaoDto valores, ETipoConexao conexao, ValoresMedicaoAnaliticoDto valorAnalitico, ParametrosRelatorioEconomiaDto paramRelatorio) {
            var listaFinal = new List<LancamentoRelatorioFinalDto>();
            var parte1 = LancMercadoLivreParte1(fatura, tarifaCalculada, relMedicoes, valores, valorAnalitico, paramRelatorio);
            var parte2 = LancMercadoLivreParte2(fatura, tarifaCalculada, relMedicoes, valores, valorAnalitico);
            var parte3 = LancMercadoLivreParte3(fatura);
            var parte4 = LancMercadoLivreParte4(fatura);
            var parte5 = LancMercadoLivreParte5(fatura);
            listaFinal.AddRange(parte1);
            listaFinal.Add(new LancamentoRelatorioFinalDto {
                Descricao = "Sub-total de compra de energia elétrica",
                Total = parte1.Where(p => p.TipoMontante != ETipoMontante.Percentual).Sum(p => p.Total),
                Totalizador = true
            });
            listaFinal.AddRange(parte2);
            listaFinal.Add(new LancamentoRelatorioFinalDto {
                Descricao = "Sub-total para base de cálculo imposto ICMS/PIS/COFINS",
                Total = parte2.Where(p => p.TipoMontante != ETipoMontante.Percentual).Sum(p => p.Total),
                Totalizador = true
            });
            listaFinal.AddRange(parte3);
            listaFinal.Add(new LancamentoRelatorioFinalDto {
                Descricao = "Total distribuidora",
                Total = parte2.Where(p => p.TipoMontante != ETipoMontante.Percentual).Sum(p => p.Total) + parte3.Where(p => p.TipoMontante != ETipoMontante.Percentual).Sum(p => p.Total),
                Totalizador = true
            });
            listaFinal.AddRange(parte4);
            listaFinal.Add(new LancamentoRelatorioFinalDto {
                Descricao = "Sub-total de valores referente a Distribuidora",
                Total = parte4.Where(p => p.TipoMontante != ETipoMontante.Percentual).Sum(p => p.Total) +
                        parte3.Where(p => p.TipoMontante != ETipoMontante.Percentual).Sum(p => p.Total) +
                        parte2.Where(p => p.TipoMontante != ETipoMontante.Percentual).Sum(p => p.Total),
                Totalizador = true
            });
            listaFinal.AddRange(parte5);
            listaFinal.Add(new LancamentoRelatorioFinalDto {
                Descricao = "Sub-total dos outros custos Mercado Livre",
                Total = parte5.Where(p => p.TipoMontante != ETipoMontante.Percentual).Sum(p => p.Total),
                Totalizador = true
            });

            var grupo = new GrupoRelatorioFinalDto {
                Ordem = ordem,
                Titulo = $"MERCADO LIVRE - {conexao.GetSigla()}",
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

        private IList<LancamentoRelatorioFinalDto> LancMercadoLivreParte1(FaturaEnergiaDto fatura, TarifaCalculadaDto tarifaCalculada, RelatorioMedicaoDto relMedicoes, ValoresCaltuloMedicaoDto valores, ValoresMedicaoAnaliticoDto valorAnalitico, ParametrosRelatorioEconomiaDto paramRelatorio) {
            List<LancamentoRelatorioFinalDto> parte1 =
                [
                    new LancamentoRelatorioFinalDto {
                        Descricao = "Perdas Reais",
                        Montante = (double)valores.ValorPerdasReais,
                        TipoMontante = ETipoMontante.Percentual
                    },
                    new LancamentoRelatorioFinalDto {
                        Descricao = "Consumo de energia considerando perdas e PROINFA",
                        Montante = (double)valorAnalitico.Quantidade,
                        TipoMontante = ETipoMontante.MWH,
                    },
                    new LancamentoRelatorioFinalDto {
                        Descricao = "PROINFA",
                        Montante = tarifaCalculada.Proinfa,
                        TipoMontante = ETipoMontante.MWH,
                    },
                    new LancamentoRelatorioFinalDto {
                        Descricao = "Consumo de energia - Longo Prazo",
                        Montante = (double)valorAnalitico.Quantidade,
                        TipoMontante = ETipoMontante.MWH,
                        Tarifa = (double)valorAnalitico.ValorUnitario,
                        Total = paramRelatorio.IncideICMS ? (double)valorAnalitico.ValorNota :  (double)valorAnalitico.ValorProduto,
                        TipoTarifa = ETipoTarifa.RS_MWH
                    },
                    new LancamentoRelatorioFinalDto {
                        Montante = (double)valorAnalitico.ComprarCurtoPrazo,
                        Descricao = "Compra de energia - Curto Prazo",
                        TipoMontante = ETipoMontante.KW,
                        Tarifa = (double)relMedicoes.ValorCompraCurtoPrazo,
                        TipoTarifa = ETipoTarifa.RS_KW
                    },
                    new LancamentoRelatorioFinalDto {
                        Montante = (double)valorAnalitico.VenderCurtoPrazo,
                        Descricao = "Venda de energia - Curto Prazo",
                        TipoMontante = ETipoMontante.KW,
                        Tarifa = (double)relMedicoes.ValorVendaCurtoPrazo,
                        TipoTarifa = ETipoTarifa.RS_KW
                    },
                    new LancamentoRelatorioFinalDto {
                        Descricao = "Desconto - TUSD (RETUSD)",
                        Total = fatura.ValorDescontoRETUSD*-1
                    }
            ];

            foreach (var lanc in fatura.LancamentosAdicionais.Where(l => l.NaturezaMercado == ETipoNaturezaMercado.LIVRE_CONSUMO)) {
                parte1.Add(new LancamentoRelatorioFinalDto {
                    Descricao = lanc.Descricao,
                    Total = lanc.Tipo.Equals(ETipoLancamento.DEBITO) ? lanc.Valor : lanc.Valor * -1
                });
            }


            return parte1;
        }

        private IList<LancamentoRelatorioFinalDto> LancMercadoLivreParte2(FaturaEnergiaDto fatura, TarifaCalculadaDto tarifaCalculada, RelatorioMedicaoDto relMedicoes, ValoresCaltuloMedicaoDto valores, ValoresMedicaoAnaliticoDto valorAnalitico) {
            List<LancamentoRelatorioFinalDto> parte2 =
                [
                    new LancamentoRelatorioFinalDto {
                        Descricao = "TUSD - Ponta (Consumido)",
                        Montante = fatura.ValorDemandaFaturadaPontaConsumida,
                        TipoMontante = ETipoMontante.KW,
                        Tarifa = tarifaCalculada.KWPontaComImposto,
                        TipoTarifa = ETipoTarifa.RS_KW
                    },
                    new LancamentoRelatorioFinalDto {
                        Descricao = "TUSD - Ponta (Não Utilizada)",
                        Montante = fatura.ValorDemandaFaturadaPontaNaoConsumida,
                        TipoMontante = ETipoMontante.KW,
                        Tarifa = tarifaCalculada.KWPontaComImposto,
                        TipoTarifa = ETipoTarifa.RS_KW
                    },
                    new LancamentoRelatorioFinalDto {
                        Descricao = "TUSD - Fora de Ponta (Consumida)",
                        Montante = fatura.ValorDemandaFaturadaForaPontaConsumida,
                        TipoMontante = ETipoMontante.KW,
                        Tarifa = tarifaCalculada.KWhForaPontaTUSDCalculadoComImposto,
                        TipoTarifa = ETipoTarifa.RS_KW
                    },
                    new LancamentoRelatorioFinalDto {
                        Descricao = "TUSD - Fora de Ponta (Não Utilizada)",
                        Montante = fatura.ValorDemandaFaturadaForaPontaNaoConsumida,
                        TipoMontante = ETipoMontante.KW,
                        Tarifa = tarifaCalculada.KWhForaPontaTUSDNaoConsumidaCalculadoComImposto,
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
                        Tarifa =   tarifaCalculada.KWhPontaTUSDCalculadoComImposto,
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

            foreach (var lanc in fatura.LancamentosAdicionais.Where(l => l.ContabilizaFatura == true && l.TipoCCEE == false && l.Descricao.StartsWith("Subvenção Tarif") && l.NaturezaMercado != ETipoNaturezaMercado.LIVRE_CONSUMO)) {
                parte2.Add(new LancamentoRelatorioFinalDto {
                    Descricao = lanc.Descricao,
                    Total = lanc.Tipo.Equals(ETipoLancamento.DEBITO) ? lanc.Valor : lanc.Valor * -1
                });
            }

            return parte2;
        }

        private IList<LancamentoRelatorioFinalDto> LancMercadoLivreParte3(FaturaEnergiaDto fatura) {
            List<LancamentoRelatorioFinalDto> ret = [];

            foreach (var lanc in fatura.LancamentosAdicionais.Where(l => l.ContabilizaFatura == true && l.TipoCCEE == false && !l.Descricao.StartsWith("Subvenção Tarif") && l.NaturezaMercado != ETipoNaturezaMercado.LIVRE_CONSUMO)) {
                ret.Add(new LancamentoRelatorioFinalDto {
                    Descricao = lanc.Descricao,
                    Total = lanc.Tipo.Equals(ETipoLancamento.DEBITO) ? lanc.Valor : lanc.Valor * -1
                });
            }

            return ret;
        }

        private IList<LancamentoRelatorioFinalDto> LancMercadoLivreParte4(FaturaEnergiaDto fatura) {
            List<LancamentoRelatorioFinalDto> ret = [];

            foreach (var lanc in fatura.LancamentosAdicionais.Where(l => l.ContabilizaFatura == false && l.TipoCCEE == false && l.NaturezaMercado != ETipoNaturezaMercado.LIVRE_CONSUMO)) {
                ret.Add(new LancamentoRelatorioFinalDto {
                    Descricao = lanc.Descricao,
                    Total = lanc.Tipo.Equals(ETipoLancamento.DEBITO) ? lanc.Valor : lanc.Valor * -1
                });
            }

            return ret;
        }

        private IList<LancamentoRelatorioFinalDto> LancMercadoLivreParte5(FaturaEnergiaDto fatura) {
            List<LancamentoRelatorioFinalDto> ret = [];

            foreach (var lanc in fatura.LancamentosAdicionais.Where(l => l.ContabilizaFatura == true && l.TipoCCEE == true && l.NaturezaMercado != ETipoNaturezaMercado.LIVRE_CONSUMO)) {
                ret.Add(new LancamentoRelatorioFinalDto {
                    Descricao = lanc.Descricao,
                    Total = lanc.Tipo.Equals(ETipoLancamento.DEBITO) ? lanc.Valor : lanc.Valor * -1
                });
            }

            return ret;
        }
    }
}
