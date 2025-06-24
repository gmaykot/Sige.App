using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Sistema.Gerencial.Empresa;

namespace SIGE.Core.Models.Sistema.Geral.Economia
{
    public class RelatorioEconomiaModel : BaseModel
    {
        public required DateTime MesReferencia { get; set; }
        public required Guid PontoMedicaoId { get; set; }
        public virtual PontoMedicaoModel? PontoMedicao { get; set; }
    }
}
