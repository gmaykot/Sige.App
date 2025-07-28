using System.Text;
using SIGE.Core.Enumerators;

namespace SIGE.Core.Models.Dto.Geral.RelatorioEconomia {
    public class ParametrosRelatorioEconomiaDto {
        public Guid? FaturamentoId { get; set; }
        public DateTime VigenciaInicial { get; set; }
        public DateTime? VigenciaFinal { get; set; }
        public double ValorFixo { get; set; }
        public double Porcentagem { get; set; }
        public double QtdeSalarios { get; set; }

        public Guid? ImpostoId { get; set; }
        public double? ValorPis { get; set; }
        public double? ValorCofins { get; set; }

        public int? ConsumoId { get; set; }
        public double? Proinfa { get; set; }
        public double? Icms { get; set; }

        public Guid? SalarioMinimoId { get; set; }
        public double? SalarioMinimoValor { get; set; }

        public Guid? EnergiaAcumuladaId { get; set; }
        public double? ValorMensalAcumulado { get; set; }
        public double? ValorTotalAcumulado { get; set; }

        public Guid? BandeiraVigenteId { get; set; }
        public ETipoBandeira? Bandeira { get; set; }
        public double? ValorBandeiraAplicado { get; set; }

        public required bool IncideICMS { get; set; } = true;

        public override string ToString() {
            StringBuilder stringBuilder = new StringBuilder();
            if (Porcentagem > 0)
                stringBuilder.Append($"{Porcentagem}% economia");
            if (ValorFixo > 0)
                stringBuilder.Append(stringBuilder.Length == 0 ? $"{ValorFixo.ToString("C", new System.Globalization.CultureInfo("pt-BR"))} fixos" : $" + {ValorFixo.ToString("C", new System.Globalization.CultureInfo("pt-BR"))} fixos");
            if (QtdeSalarios > 0)
                stringBuilder.Append(stringBuilder.Length == 0 ? $"{QtdeSalarios} Sal. Mínimo" : $" + {QtdeSalarios} Sal. Mínimo");
            return stringBuilder.ToString(); ;
        }
    }
}
