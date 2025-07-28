using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Sistema.Gerencial.Empresa;
using System.Text;

namespace SIGE.Core.Models.Sistema.Geral
{
    public class FaturamentoCoenelModel : BaseModel
    {
        public required DateTime VigenciaInicial { get; set; }
        public DateTime? VigenciaFinal { get; set; }
        public required double ValorFixo { get; set; }
        public required double QtdeSalarios { get; set; }
        public required double Porcentagem { get; set; }
        public required Guid PontoMedicaoId { get; set; }
        public virtual PontoMedicaoModel? PontoMedicao { get; set; }

        public override string ToString()
        {
            StringBuilder stringBuilder = new StringBuilder();
            if (Porcentagem > 0)
                stringBuilder.Append($"{Porcentagem}% economia");
            if (ValorFixo > 0)
                stringBuilder.Append(stringBuilder.Length == 0 ?  $"{ValorFixo.ToString("C", new System.Globalization.CultureInfo("pt-BR"))} fixos": $" + {ValorFixo.ToString("C", new System.Globalization.CultureInfo("pt-BR"))} fixos");
            if (QtdeSalarios > 0)
                stringBuilder.Append(stringBuilder.Length == 0 ? $"{QtdeSalarios} Sal. Mínimo" : $" + {QtdeSalarios} Sal. Mínimo");
            return stringBuilder.ToString(); ;
        }
    }
}
