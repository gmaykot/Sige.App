using System.Text;

namespace SIGE.Core.Models.Dto.Geral.RelatorioEconomia
{
    public class LancamentoComparativoDto
    {
        public string? Descricao { get; set; }
        public double? Percentual { get; set; }
        public double? Valor { get; set; } = 0;
        public string? Observacao{ get; set; }
        public bool SubTotal { get; set; } = false;
        public bool Total { get; set; } = false;
    }
}
