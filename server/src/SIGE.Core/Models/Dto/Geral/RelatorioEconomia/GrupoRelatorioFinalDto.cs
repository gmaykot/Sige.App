namespace SIGE.Core.Models.Dto.Geral.RelatorioEconomia
{
    public class GrupoRelatorioFinalDto
    {
        public int? Ordem { get; set; } = 0;
        public required string Titulo { get; set; }
        public string ColunaQuantidade { get; set; } = "Montante";
        public string ColunaValor { get; set; } = "Tarifa";
        public string ColunaTotal { get; set; } = "Valor";
        public IEnumerable<SubGrupoRelatorioFinalDto>? SubGrupos { get; set; }
        public LancamentoRelatorioFinalDto? Total { get; set; }
    }
}