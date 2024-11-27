using SIGE.Core.Enumerators;

namespace SIGE.Core.Models.Dto.Geral.RelatorioEconomia
{
    public class LancamentoRelatorioFinalDto
    {
        public int Ordem { get; set; } = 0;
        public required string Descricao { get; set; }
        public double? Quantidade { get; set; }
        public ETipoQuantidade? TipoQuantidade { get; set; }
        public double? Valor { get; set; }
        public ETipoValor? TipoValor { get; set; }
        public double? Total { get; set; }
        public ETipoLancamento TipoLancamento { get; set; }
    }
}
