using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Sistema.Medicao;

namespace SIGE.Core.Models.Sistema.Faturamento
{
    public class FaturamentoCoenelModel : BaseModel
    {
        public required DateTime VigenciaInicial { get; set; }
        public required DateTime VigenciaFinal { get; set; }
        public required double ValorFixo { get; set; }
        public required double QtdeSalarios { get; set; }
        public required double Porcentagem { get; set; }
        public required Guid PontoMedicaoId { get; set; }
        public virtual PontoMedicaoModel? PontoMedicao { get; set; }
    }
}
