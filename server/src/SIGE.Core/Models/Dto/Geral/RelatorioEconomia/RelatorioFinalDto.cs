namespace SIGE.Core.Models.Dto.Geral.RelatorioEconomia
{
    public class RelatorioFinalDto
    {
        public CabecalhoRelatorioFinalDto Cabecalho { get; set; }
        public List<GrupoRelatorioFinalDto> Grupos { get; set; }
        public ComparativoRelatorioFinalDto Comparativo { get; set; }
        public GraficoRelatorioFinalDto Grafico { get; set; }
    }
}
