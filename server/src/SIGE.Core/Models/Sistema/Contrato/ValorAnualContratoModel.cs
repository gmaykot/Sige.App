using SIGE.Core.Models.Defaults;

namespace SIGE.Core.Models.Sistema.Contrato
{
    public class ValorAnualContratoModel : BaseModel
    {
        public required DateTime DataVigenciaInicial { get; set; }
        public required DateTime DataVigenciaFinal { get; set; }
        public required decimal ValorUnitarioKwh { get; set; }
        public Guid ContratoId { get; set; }
        public virtual ContratoModel? Contrato { get; set; }
        public virtual IEnumerable<ValorMensalContratoModel>? ValoresMensaisContrato { get; set; }
    }
}
