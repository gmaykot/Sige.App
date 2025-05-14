using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SIGE.Core.Enumerators;
using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Geral.RelatorioEconomia;
using SIGE.Core.SQLFactory;
using SIGE.DataAccess.Context;
using SIGE.Services.Interfaces.Geral;

namespace SIGE.Services.Services.Geral
{
    public class RelatorioEconomiaService(AppDbContext appDbContext, IMapper mapper) : IRelatorioEconomiaService
    {
        private readonly AppDbContext _appDbContext = appDbContext;
        private readonly IMapper _mapper = mapper;

        public async Task<Response> ListarRelatorios(DateOnly mesReferencia)
        {
            var ret = new Response();
            var res = await _appDbContext.Database.SqlQueryRaw<RelatorioEconomiaListDto>(RelatorioEconomiaFactory.ListaRelatoriosMedicao(mesReferencia)).ToListAsync();
            if (res != null && res.Count != 0)
                return ret.SetOk().SetData(res.DistinctBy(m => (m.DescPontoMedicao, m.MesReferencia)).OrderByDescending(m => (m.MesReferencia, m.DescPontoMedicao)));

            return ret.SetNotFound().AddError(ETipoErro.INFORMATIVO, $"Sem relatório de economia no período.");
        }

        public async Task<Response> ObterFinalPdf(Guid pontoMedicaoId, DateOnly mesReferencia)
        {
            var ret = new Response();
            var relatorio = new RelatorioFinalDto
            {
                Cabecalho = new CabecalhoRelatorioFinalDto
                {
                    Titulo = "QUADRO COMPARATIVO MENSAL MERCADO CATIVO X LIVRE",
                    SubTitulo = "ROTA INDÚSTRIA GRÁFICA LTDA",
                    Unidade = "Estrela",
                    SubMercado = "Sul",
                    Conexao = "A4",
                    Concessao = "RGE Sul",
                    DataAnalise = DataSige.Hoje(),
                    MesReferencia = "Outubro/24",
                    NumerorDiasMes = 31,
                    PeriodoHoroSazonal = "Bandeira Verde"
                },
                Grupos = [
                    new GrupoRelatorioFinalDto {
                        Ordem = 1,
                        Titulo = "MERCADO CATIVO - A4 - TOTAL",
                        ColunaQuantidade = "Montante",
                        ColunaValor = "Tarifa",
                        ColunaTotal = "Total",
                        SubGrupos = [
                            new SubGrupoRelatorioFinalDto {
                                Lancamentos = [
                                    new LancamentoRelatorioFinalDto {
                                        Descricao = "Demanda Contratada - Ponta",
                                        Observacao = "Tarifa Fornecimento - Resolução ANEEL nº 3.206, 13/06/2023"
                                    },
                                    new LancamentoRelatorioFinalDto {
                                        Descricao = "Demanda Contratada - Fora de Ponta",
                                        Montante = 500,
                                        TipoMontante = ETipoMontante.KW,
                                        Tarifa = 40,
                                        TipoTarifa = ETipoTarifa.RS_KW
                                    },
                                    new LancamentoRelatorioFinalDto {
                                        Descricao = "Demanda Faturada - Ponta",
                                    },
                                    new LancamentoRelatorioFinalDto {
                                        Descricao = "Demanda Faturada - Fora de Ponta",
                                        Montante = 484,
                                        TipoMontante = ETipoMontante.KW,
                                        Tarifa = 32.70933401,
                                        TipoTarifa = ETipoTarifa.RS_KW
                                    },
                                    new LancamentoRelatorioFinalDto {
                                        Descricao = "Demanda Faturada - Fora de Ponta",
                                        Montante = 16,
                                        TipoMontante = ETipoMontante.KW,
                                        Tarifa = 27.14874722,
                                        TipoTarifa = ETipoTarifa.RS_KW
                                    },
                                    new LancamentoRelatorioFinalDto {
                                        Descricao = "Demanda Ultrapassagem - Fora de Ponta",
                                        Tarifa = 65.41866801,
                                        TipoTarifa = ETipoTarifa.RS_KW
                                    },
                                    new LancamentoRelatorioFinalDto {
                                        Descricao = "Demanda Reativa - Ponta",
                                    },
                                    new LancamentoRelatorioFinalDto {
                                        Descricao = "Demanda Reativa - Fora de Ponta",
                                    },
                                    new LancamentoRelatorioFinalDto {
                                        Descricao = "Consumo Medido - Ponta - TUSD",
                                        Montante = 9476,
                                        TipoMontante = ETipoMontante.KW,
                                        Tarifa = 2.04303417,
                                        TipoTarifa = ETipoTarifa.RS_KWH
                                    },
                                    new LancamentoRelatorioFinalDto {
                                        Descricao = "Consumo Medido - Fora de Ponta - TUSD",
                                        Montante = 75316,
                                        TipoMontante = ETipoMontante.KW,
                                        Tarifa = 0.11999791,
                                        TipoTarifa = ETipoTarifa.RS_KWH
                                    },
                                    new LancamentoRelatorioFinalDto {
                                        Descricao = "Consumo Medido - Ponta - TE",
                                        Montante = 9476,
                                        TipoMontante = ETipoMontante.KW,
                                        Tarifa = 0.49644406,
                                        TipoTarifa = ETipoTarifa.RS_KWH
                                    },
                                    new LancamentoRelatorioFinalDto {
                                        Descricao = "Consumo Medido - Fora de Ponta - TE",
                                        Montante = 75316,
                                        TipoMontante = ETipoMontante.KW,
                                        Tarifa = 0.31480680,
                                        TipoTarifa = ETipoTarifa.RS_KWH
                                    },
                                    new LancamentoRelatorioFinalDto {
                                        Descricao = "Adicional Bandeira Verde Ponta",
                                    },
                                    new LancamentoRelatorioFinalDto {
                                        Descricao = "Adicional Bandeira Verde F. Ponta",
                                    },
                                    new LancamentoRelatorioFinalDto {
                                        Descricao = "Consumo Medido Reativo - Ponta",
                                        Tarifa = 0.36667518,
                                        TipoTarifa = ETipoTarifa.RS_KW
                                    },
                                    new LancamentoRelatorioFinalDto {
                                        Descricao = "Consumo Medido Reativo - Fora de Ponta",
                                        Montante = 60.228,
                                        TipoMontante = ETipoMontante.KW,
                                        Tarifa = 0.36992761,
                                        TipoTarifa = ETipoTarifa.RS_KWH
                                    },
                                ],
                                Total = new LancamentoRelatorioFinalDto {
                                    Descricao = "Total geral mercado cativo (impostos inclusos)",
                                    Montante = 84792,
                                    TipoMontante = ETipoMontante.KWH,
                                    Tarifa = 0.8621,
                                    TipoTarifa = ETipoTarifa.RS_KWH,
                                }
                            }
                        ],
                    },
                    new GrupoRelatorioFinalDto {
                        Ordem = 2,
                        Titulo = "MERCADO LIVRE - A4",
                        ColunaQuantidade = "Montante",
                        ColunaValor = "Tarifa",
                        ColunaTotal = "Total",
                        SubGrupos = [
                            new SubGrupoRelatorioFinalDto {
                                Lancamentos = [
                                    new LancamentoRelatorioFinalDto {
                                        Descricao = "Perdas Reais",
                                        Montante = 3,
                                        TipoMontante=ETipoMontante.Percentual,
                                    },
                                    new LancamentoRelatorioFinalDto {
                                        Descricao = "Consumo de Energia Considerando Perdas e PROINFA",
                                        Montante = 87.346,
                                        TipoMontante = ETipoMontante.MWH,
                                    },
                                    new LancamentoRelatorioFinalDto {
                                        Descricao = "PROINFA",
                                        Montante = 1.998,
                                        TipoMontante = ETipoMontante.MWH
                                    },
                                    new LancamentoRelatorioFinalDto {
                                        Descricao = "Consumo de Energia - Longo Prazo",
                                        Montante = 80.287,
                                        TipoMontante = ETipoMontante.MWH,
                                        Tarifa = 282.94,
                                        TipoTarifa = ETipoTarifa.RS_MWH
                                    },
                                    new LancamentoRelatorioFinalDto {
                                        Descricao = "Consumo de Energia - Curto Prazo",
                                        Montante = 5.061,
                                        TipoMontante = ETipoMontante.MWH,
                                        Tarifa = 132.59,
                                        TipoTarifa = ETipoTarifa.RS_MWH
                                    },
                                    new LancamentoRelatorioFinalDto {
                                        Descricao = "Sub-total de compra de energia elétrica",
                                        Total = 28177.64,
                                        Totalizador = true
                                    },
                                    new LancamentoRelatorioFinalDto {
                                        Descricao = "TUSD-Verde = 50,00% TUSD - Ponta",
                                    },
                                    new LancamentoRelatorioFinalDto {
                                        Descricao = "TUSD - Fora de Ponta",
                                        Montante = 484,
                                        TipoMontante = ETipoMontante.KW,
                                        Tarifa = 16.42147803,
                                        TipoTarifa = ETipoTarifa.RS_KW
                                    },
                                    new LancamentoRelatorioFinalDto {
                                        Descricao = "TUSD - Fora de Ponta",
                                        Montante = 16,
                                        TipoMontante = ETipoMontante.KW,
                                        Tarifa = 13.62867111,
                                        TipoTarifa = ETipoTarifa.RS_KW
                                    },
                                    new LancamentoRelatorioFinalDto {
                                        Descricao = "TUSD Ultrapassagem- Fora de Ponta",
                                    },
                                    new LancamentoRelatorioFinalDto {
                                        Descricao = "Demanda Reativa - Ponta",
                                    },
                                    new LancamentoRelatorioFinalDto {
                                        Descricao = "Demanda Reativa - Fora de Ponta",
                                    },
                                    new LancamentoRelatorioFinalDto {
                                        Descricao = "TUSD Encargos - Ponta",
                                        Montante = 9476,
                                        TipoMontante = ETipoMontante.KW,
                                        Tarifa = 1.08544402,
                                        TipoTarifa = ETipoTarifa.RS_KWH
                                    },
                                    new LancamentoRelatorioFinalDto {
                                        Descricao = "TUSD Encargos - Fora de Ponta",
                                        Montante = 75316,
                                        TipoMontante = ETipoMontante.KW,
                                        Tarifa = 0.11999791,
                                        TipoTarifa = ETipoTarifa.RS_KWH
                                    },
                                    new LancamentoRelatorioFinalDto {
                                        Descricao = "Consumo Reativo - Ponta",
                                        Tarifa = 0.36667518,
                                        TipoTarifa = ETipoTarifa.RS_KWH
                                    },
                                    new LancamentoRelatorioFinalDto {
                                        Descricao = "Consumo Reativo - Fora de Ponta",
                                        Montante = 60.228,
                                        TipoMontante = ETipoMontante.KW,
                                        Tarifa = 0.36992761,
                                        TipoTarifa = ETipoTarifa.RS_KWH
                                    },
                                    new LancamentoRelatorioFinalDto {
                                        Descricao = "Subvenção Tarifária - TUSD - Com ICMS DEZ/23",
                                        Total = 16957.42,
                                        SubTotalizador = true
                                    },
                                    new LancamentoRelatorioFinalDto {
                                        Descricao = "Subvenção Tarifária - TUSD - Sem ICMS DEZ/23",
                                        Total = 216.31,
                                        SubTotalizador = true
                                    },
                                    new LancamentoRelatorioFinalDto {
                                        Descricao = "Sub-total para base de cálculo imposto ICMS/PIS/COFINS",
                                        Total = 44685.51,
                                        Totalizador = true
                                    },
                                    new LancamentoRelatorioFinalDto {
                                        Descricao = "Ajustes da TUSD",
                                        Total = 36.85,
                                    },
                                    new LancamentoRelatorioFinalDto {
                                        Descricao = "Credito Subv. Tarifa ACL Tusd",
                                        Total = -13517.83,
                                    },
                                    new LancamentoRelatorioFinalDto {
                                        Descricao = "Total distribuidora",
                                        Total = 31204.53,
                                        Totalizador = true
                                    },
                                    new LancamentoRelatorioFinalDto {
                                        Descricao = "Ressarcimento",
                                    },
                                    new LancamentoRelatorioFinalDto {
                                        Descricao = "Multa",
                                    },
                                    new LancamentoRelatorioFinalDto {
                                        Descricao = "Juros",
                                    },
                                    new LancamentoRelatorioFinalDto {
                                        Descricao = "Sub-total de valores referente a Distribuidora",
                                        Total = 31273.79,
                                        Totalizador = true
                                    },
                                    new LancamentoRelatorioFinalDto {
                                        Descricao = "Serviço Depositário Qualificado - Bradesco Ref.: 12/23",
                                        Total = 42.24,
                                    },
                                    new LancamentoRelatorioFinalDto {
                                        Descricao = "EER - Energia de Reserva - 11/23",
                                        Total = 1741.31,
                                    },
                                    new LancamentoRelatorioFinalDto {
                                        Descricao = "Contribuição Associativa mensal CCEE - 12/23- Vcto. 29.12.23",
                                        Total = 63.13,
                                    },
                                    new LancamentoRelatorioFinalDto {
                                        Descricao = "Liq. Fin. CCEE - DEVEDOR/CREDOR (ref. 10/23) Vcto.: 11.12.23",
                                        Total = 174.27,
                                    },
                                    new LancamentoRelatorioFinalDto {
                                        Descricao = "Sub-total dos outros custos mercado livre",
                                        Total = 2020.95,
                                        Totalizador = true
                                    },
                                ],
                                Total = new LancamentoRelatorioFinalDto {
                                    Descricao = "Total geral mercado cativo (impostos inclusos)",
                                    Tarifa = 0.7242,
                                    TipoTarifa = ETipoTarifa.RS_KWH,
                                    Total = 61403.12
                                }
                            }
                        ],
                    },
                ]
            };

            return ret.SetOk().SetData(relatorio);
        }

        public async Task<Response> ObterFinal(Guid pontoMedicaoId, DateOnly mesReferencia)
        {
            var ret = new Response();
            var res = await _appDbContext.Database.SqlQueryRaw<CabecalhoRelatorioFinalDto>(RelatorioEconomiaFactory.RelatorioFinal(pontoMedicaoId, mesReferencia)).FirstOrDefaultAsync();
            if (res != null)
            {
                var relatorio = new RelatorioFinalDto
                {
                    Cabecalho = res
                };
                return ret.SetOk().SetData(relatorio);
            }
            
            return ret.SetNotFound().AddError(ETipoErro.INFORMATIVO, $"Sem relatório de economia no período.");
        }
    }
}
