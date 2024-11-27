using SIGE.Core.Models.Defaults;

namespace SIGE.Core.Models.Sistema.Geral.Medicao
{
    public class MedicoesModel : BaseModel
    {
        public Guid ConsumoMensalId { get; set; }
        public virtual ConsumoMensalModel? ConsumoMensal { get; set; }
        public DateTime Periodo { get; set; }
        public string? SubTipo { get; set; }
        public string? Status { get; set; }
        public double ConsumoAtivo { get; set; }
        public double ConsumoReativo { get; set; }
    }
}
