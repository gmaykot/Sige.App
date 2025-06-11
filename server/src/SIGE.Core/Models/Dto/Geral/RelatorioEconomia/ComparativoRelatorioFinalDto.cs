namespace SIGE.Core.Models.Dto.Geral.RelatorioEconomia
{
    public class ComparativoRelatorioFinalDto
    {
        public string? Titulo { get; set; }
        public string? Observacao { get; set; }
        public List<LancamentoComparativoDto>? Lancamentos { get; set; }
    }
}
