using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SIGE.Core.Enumerators;
using SIGE.Core.Extensions;
using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Geral.RelatorioEconomia;
using SIGE.Core.Models.Dto.Geral.RelatorioMedicao;
using SIGE.Core.Models.Requests;
using SIGE.Core.Models.Sistema.Geral.Medicao;
using SIGE.Core.SQLFactory;
using SIGE.DataAccess.Context;
using SIGE.Services.Interfaces.Geral;

namespace SIGE.Services.Services.Geral
{
    public class RelatorioMedicaoService(AppDbContext appDbContext, IMapper mapper) : IRelatorioMedicaoService
    {
        private readonly AppDbContext _appDbContext = appDbContext;
        private readonly IMapper _mapper = mapper;

        public async Task<Response> ListarRelatorios(RelatorioMedicaoRequest req)
        {
            var ret = new Response();
            var res = await _appDbContext.Database.SqlQueryRaw<RelatorioMedicaoListDto>(RelatorioMedicaoFactory.ListaRelatoriosMedicao(req)).ToListAsync();
            if (res != null && res.Count != 0)
                return ret.SetOk().SetData(res.DistinctBy(m => m.DescGrupo).OrderByDescending(m => m.MesReferencia));

            return ret.SetNotFound().AddError(ETipoErro.INFORMATIVO, $"Sem relatório de economia no período.");
        }

        public async Task<Response> Obter(Guid contratoId, DateTime mesReferencia)
        {
            var ret = new Response();

            var rel = await _appDbContext.RelatoriosMedicao.FirstOrDefaultAsync(r => r.ContratoId.Equals(contratoId) && r.MesReferencia.Equals(mesReferencia));
            var res = await _appDbContext.Database.SqlQueryRaw<RelatorioMedicaoDto>(RelatorioMedicaoFactory.ValoresRelatoriosMedicao(contratoId, mesReferencia, null)).FirstOrDefaultAsync();
            if (res == null)
                return ret.SetNotFound().AddError(ETipoErro.INFORMATIVO, $"Verifique se a medição da competência foram efetuadas.")
                                        .AddError(ETipoErro.INFORMATIVO, $"Verifique se os valores contratuais estão cadastrados.");
            
            if (rel != null)
                _mapper.Map(rel, res);

            res.ValoresAnaliticos = [];
            res.ContratoId = contratoId;

            var empresas = await _appDbContext.Database.SqlQueryRaw<Guid>(ContratosFactory.EmpresasPorContrato(contratoId)).ToListAsync();

            empresas.ForEach(empresaId =>
            {
                var valores = _appDbContext.Database.SqlQueryRaw<ValorAnaliticoMedicaoDto>(RelatorioMedicaoFactory.ValoresRelatoriosMedicao(contratoId, mesReferencia, empresaId)).FirstOrDefault();
                res.ValoresAnaliticos.Add(valores);
            });

            res.MesReferencia = mesReferencia;
            res.DataEmissao = DateTime.Now.Hoje();

            if (rel == null)
            {
                res.Id = Guid.Empty;
                res.Fase = EFaseMedicao.RELATORIO_MEDICAO;
                await _appDbContext.RelatoriosMedicao.AddAsync(_mapper.Map<RelatorioMedicaoModel>(res));
            }
            else
            {
                res.Id = rel.Id;
                _mapper.Map(res, rel);
            }
                

            _appDbContext.SaveChanges();

            return ret.SetOk().SetData(res);
        }

        public async Task<Response> ObterFinal(Guid contratoId, DateTime competencia)
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
                    DataAnalise = DateTime.Now,
                    MesReferencia = "Outubro/24",
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
