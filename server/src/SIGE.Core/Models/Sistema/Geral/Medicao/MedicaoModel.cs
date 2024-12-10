using SIGE.Core.Enumerators.Medicao;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SIGE.Core.Models.Sistema.Geral.Medicao
{
    public class MedicaoModel
    {
        [Key]
        public required int Id { get; set; }
        public DateTime DataMedicao { get; set; }
        public required ESubTipoMedicao SubTipo { get; set; }
        public required EStatusMedicao Status { get; set; }
        public required float ValorConsumoAtivo { get; set; }

        [ForeignKey("ConsumosMensais")]
        public required int ConsumoMensalId { get; set; }

        #region Virtual
        public virtual ConsumoMensalModel? ConsumoMensal { get; set; }
        #endregion
    }
}
