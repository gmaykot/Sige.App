using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Sistema.Gerencial.Empresa;

namespace SIGE.Core.Models.Sistema.Gerencial.GerenciamentoMensal {
    public class EncargosCCEEModel : BaseModel {
        public required DateTime MesReferencia { get; set; }
        public required double Valor { get; set; }

        public required Guid TipoEncargosCCEEId { get; set; }
        public virtual TipoEncargosCCEEModel? TipoEncargosCCEE { get; set; }

        public required Guid PontoMedicaoId { get; set; }
        public virtual PontoMedicaoModel? PontoMedicao { get; set; }
    }
}
