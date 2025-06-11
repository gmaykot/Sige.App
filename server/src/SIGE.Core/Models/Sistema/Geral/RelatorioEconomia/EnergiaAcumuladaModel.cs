using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Sistema.Geral.Medicao;

namespace SIGE.Core.Models.Sistema.Geral.Economia
{
    public class EnergiaAcumuladaModel : BaseModel
    {
        public required DateTime MesReferencia { get; set; }
        public required double ValorMensalAcumulado { get; set; }
        public required double ValorTotalAcumulado { get; set; }
        public required Guid PontoMedicaoId { get; set; }
        public virtual PontoMedicaoModel? PontoMedicao { get; set; }
    }
}
