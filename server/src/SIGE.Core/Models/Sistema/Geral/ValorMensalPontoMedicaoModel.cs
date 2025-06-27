using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Sistema.Gerencial.Empresa;

namespace SIGE.Core.Models.Sistema.Geral
{
    public class ValorMensalPontoMedicaoModel : BaseModel
    {
        public DateOnly? MesReferencia { get; set; }
        public required double Proinfa { get; set; }
        public required double Icms { get; set; }

        public required Guid PontoMedicaoId { get; set; }
        public virtual PontoMedicaoModel? PontoMedicao { get; set; }
    }
}
