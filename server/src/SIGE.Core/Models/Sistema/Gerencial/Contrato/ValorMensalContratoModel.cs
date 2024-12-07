using SIGE.Core.Models.Defaults;

namespace SIGE.Core.Models.Sistema.Gerencial.Contrato
{
    public class ValorMensalContratoModel : BaseModel
    {
        public required DateTime MesReferencia { get; set; }
        public required decimal HorasMes { get; set; }
        public required decimal EnergiaContratada { get; set; }
        public Guid ValorAnualContratoId { get; set; }
        public virtual ValorAnualContratoModel? ValorAnualContrato { get; set; }
    }
}
