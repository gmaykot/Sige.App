using SIGE.Core.Enumerators;
using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Sistema.Gerencial;

namespace SIGE.Core.Models.Sistema.Geral {
    public class DescontoTusdModel : BaseModel {
        public DateOnly? MesReferencia { get; set; }
        public double? ValorDescontoTUSD { get; set; }
        public required ETipoEnergia TipoEnergia { get; set; }

        public required Guid FornecedorId { get; set; }
        public virtual FornecedorModel? Fornecedor { get; set; }
    }
}
