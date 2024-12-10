using SIGE.Core.Enumerators;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SIGE.Core.Models.Sistema.Geral.Medicao
{
    public class ConsumoMensalModel
    {
        [Key]
        public int Id { get; set; }

        public required DateOnly MesReferencia { get; set; }
        public required DateTime DataMedicao { get; set; }
        public required float Icms { get; set; }
        public float Proinfa { get; set; }
        public EStatusConsumoMensal Status { get; set; }

        [ForeignKey("PontosMedicao")]
        public Guid PontoMedicaoId { get; set; }

        #region Virtual
        public virtual PontoMedicaoModel? PontoMedicao { get; set; }
        public virtual IEnumerable<MedicaoModel>? Medicoes { get; set; }
        #endregion
    }
}
