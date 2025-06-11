using SIGE.Core.Enumerators;
using SIGE.Core.Models.Defaults;
using System.ComponentModel.DataAnnotations.Schema;

namespace SIGE.Core.Models.Sistema.Geral.Medicao
{
    public class ConsumoMensalModel : NewBaseModel
    {
        public DateOnly MesReferencia { get; set; }
        public DateOnly DataMedicao { get; set; }
        public float Icms { get; set; }
        public float Proinfa { get; set; }
        public EStatusMedicao StatusMedicao { get; set; }

        [ForeignKey("PontoMedicao")]
        public Guid PontoMedicaoId { get; set; }

        public virtual PontoMedicaoModel? PontoMedicao { get; set; }
        public virtual IEnumerable<MedicoesModel>? Medicoes { get; set; }
    }
}
