using SIGE.Core.Enumerators;
using SIGE.Core.Models.Defaults;

namespace SIGE.Core.Models.Sistema.Gerencial.GerenciamentoMensal {
    public class TipoEncargosCCEEModel : BaseModel {
        public required string Descricao { get; set; }
        public required int MesMenos { get; set; }
        public required ETipoLancamento Tipo { get; set; }

        public virtual IEnumerable<EncargosCCEEModel>? EncargosCCEE { get; set; }
    }
}
