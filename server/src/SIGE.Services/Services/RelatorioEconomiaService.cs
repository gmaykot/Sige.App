using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SIGE.Core.Enumerators;
using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.RelatorioEconomia;
using SIGE.Core.Models.Requests;
using SIGE.Core.SQLFactory;
using SIGE.DataAccess.Context;
using SIGE.Services.Interfaces;

namespace SIGE.Services.Services
{
    public class RelatorioEconomiaService(AppDbContext appDbContext, IMapper mapper): IRelatorioEconomiaService
    {
        private readonly AppDbContext _appDbContext = appDbContext;
        private readonly IMapper _mapper = mapper;

        public async Task<Response> ListarRelatorios(RelatorioEconomiaRequest req)
        {
            var ret = new Response();
            var res = await _appDbContext.Database.SqlQueryRaw<RelatorioEconomiaListDto>(RelatorioEconomiaFactory.ListaRelatoriosEconomia(req)).ToListAsync();
            if (res != null && res.Count != 0)
                return ret.SetOk().SetData(res.DistinctBy(m => m.DescGrupo).OrderByDescending(m => m.Competencia));

            return ret.SetNotFound().AddError(ETipoErro.INFORMATIVO, $"Sem relatório de economia no período.");
        }

        public async Task<Response> Obter(Guid contratoId, DateTime competencia)
        {
            var ret = new Response();

            var rel = await _appDbContext.RelatoriosEconomia.FirstOrDefaultAsync(r =>r.ContratoId.Equals(contratoId));
            var relDto = new RelatorioEconomiaDto();
            if (rel == null)
            {
                var res = await _appDbContext.Database.SqlQueryRaw<RelatorioEconomiaDto>(RelatorioEconomiaFactory.ValoresRelatoriosEconomia(contratoId, competencia, null)).FirstOrDefaultAsync();
                if (res == null)
                    return ret.SetNotFound().AddError(ETipoErro.INFORMATIVO, $"Verifique se a medição da competência foram efetuadas.")
                                            .AddError(ETipoErro.INFORMATIVO, $"Verifique os valores contratuais cadastrados.");

                res.ValoresAnaliticos = [];
                res.ContratoId = contratoId;

                var empresas = await _appDbContext.Database.SqlQueryRaw<Guid>(ContratosFactory.EmpresasPorContrato(contratoId)).ToListAsync();

                empresas.ForEach(empresaId =>
                {
                    var valores = _appDbContext.Database.SqlQueryRaw<ValorAnaliticosEconomiaDto>(RelatorioEconomiaFactory.ValoresRelatoriosEconomia(contratoId, competencia, empresaId)).FirstOrDefault();
                    res.ValoresAnaliticos.Add(valores);
                });
                
                return ret.SetOk().SetData(res);
            }
            else
                relDto = _mapper.Map<RelatorioEconomiaDto>(rel);

            return ret.SetNotFound();
        }

        public async Task<Response> ObterFinal(Guid contratoId, DateTime competencia)
        {
            var ret = new Response();
            var relatorio = new RelatorioFinalDto
            {
                Cabecalho = new CabecalhoRelatorioFinalDto {
                    Titulo = "QUADRO COMPARATIVO MENSAL MERCADO CATIVO X LIVRE",
                    SubTitulo = "ROTA INDÚSTRIA GRÁFICA LTDA",
                    Unidade = "Estrela",
                    SubMercado = "Sul",
                    Conexao = "A4",
                    Concessao = "RGE Sul",
                    DataAnalise = DateTime.Now,
                    MesAno = "Outubro/24",
                    NumerorDiasMes = 31,
                    PeriodoHoroSazonal = "Bandeira Verde"
                },
                Grupos = [
                    new GrupoRelatorioFinalDto {
                        Ordem = 0,
                        Titulo = "MERCADO CATIVO - A4 - TOTAL",
                        ColunaQuantidade = "Montante",
                        ColunaValor = "Tarifa",
                        ColunaTotal = "Total",
                        SubGrupos = [
                            new SubGrupoRelatorioFinalDto {
                                Lancamentos = [
                                    new LancamentoRelatorioFinalDto {
                                        Descricao = "demanda contratada - ponta",
                                    },
                                    new LancamentoRelatorioFinalDto {
                                        Descricao = "demanda contratada - fora de ponta",
                                        Quantidade = 500,
                                        TipoQuantidade = ETipoQuantidade.KW,
                                    }
                                ],
                                Total = new LancamentoRelatorioFinalDto {
                                    Descricao = "Total geral mercado cativo (impostos inclusos)",
                                    Quantidade = 84792,
                                    TipoQuantidade = ETipoQuantidade.KWH,
                                    Valor = 0.8339,
                                    TipoValor = ETipoValor.RS_KWH,
                                    Total = 70709.43
                                }
                            }
                        ],
                    }
                ]
            };
            
            return ret.SetOk().SetData(relatorio);
        }
    }
}
