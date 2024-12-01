namespace SIGE.Core.Models.Dto.Geral.RelatorioEconomia
{
    public class SubGrupoRelatorioFinalDto
    {
        public required IEnumerable<LancamentoRelatorioFinalDto> Lancamentos { get; set; }
        public required LancamentoRelatorioFinalDto Total { get; set; }
    }
}
