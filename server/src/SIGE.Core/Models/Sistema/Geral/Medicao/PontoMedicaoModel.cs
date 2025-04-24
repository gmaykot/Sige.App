using SIGE.Core.Enumerators;
using SIGE.Core.Models.Defaults;

namespace SIGE.Core.Models.Sistema.Geral.Medicao
{
    public class PontoMedicaoModel : BaseModel
    {
        public required string Nome { get; set; }
        public required string Codigo { get; set; }
        public required ETipoSegmentoContrato Segmento { get; set; }
        public Guid AgenteMedicaoId { get; set; }
        public AgenteMedicaoModel? AgenteMedicao { get; set; }
        public IEnumerable<ConsumoMensalModel>? ConsumosMensal { get; set; }
    }
}
