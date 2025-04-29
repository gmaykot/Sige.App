using SIGE.Core.Enumerators;

namespace SIGE.Core.Models.Dto.Geral.RelatorioEconomia
{
    public class LancamentoRelatorioFinalDto
    {
        public int Ordem { get; set; } = 0;
        public required string Descricao { get; set; }
        public string? Observacao { get; set; }

        public double? Montante { get; set; }
        public ETipoMontante? TipoMontante { get; set; }

        public double? Tarifa { get; set; }
        public ETipoTarifa? TipoTarifa { get; set; }

        private double? _total;
        public double? Total
        {
            get
            {
                if (Montante.HasValue && Tarifa.HasValue)
                    return Montante.Value * Tarifa.Value;

                return _total;
            }
            set
            {
                _total = value;
            }
        }

        public ETipoLancamento TipoLancamento { get; set; }

        public bool SubTotalizador { get; set; } = false;
        public bool Totalizador { get; set; } = false;
    }
}
