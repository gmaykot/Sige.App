using SIGE.Core.Enumerators;
using SIGE.Core.Models.Defaults;

namespace SIGE.Core.Models.Sistema.Medicao
{
    public class ConsumoMensalModel : BaseModel
    {
        public DateTime MesReferencia { get; set; }
        public DateTime DataMedicao { get; set; }
        public decimal Icms { get; set; }
        public decimal Proinfa { get; set; }
        public EStatusMedicao StatusMedicao {  get; set; }
        public Guid PontoMedicaoId { get; set; }
        public virtual PontoMedicaoModel? PontoMedicao { get; set; }
        public IEnumerable<MedicoesModel>? Medicoes { get; set; }
    }
}
