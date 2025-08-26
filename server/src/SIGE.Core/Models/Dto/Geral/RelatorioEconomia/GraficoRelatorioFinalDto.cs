namespace SIGE.Core.Models.Dto.Geral.RelatorioEconomia
{
    public class GraficoRelatorioFinalDto
    {
        public string? Titulo { get; set; }
        public List<LinhaGraficoFinalDto>? Linhas { get; set; } = [];
    }

    public class LinhaGraficoFinalDto
    {
        public string? Label { get; set; }
        public double? Valor { get; set; }
    }
}
