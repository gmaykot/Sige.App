using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Sistema.Gerencial.Empresa;

namespace SIGE.Core.Models.Sistema.Geral
{
    public class DescontoTusdModel : BaseModel
    {
        public DateOnly? MesReferencia { get; set; }
        public double? ValorDescontoTUSD { get; set; }
        public double? ValorDescontoRETUSD { get; set; }

        public required Guid AgenteMedicaoId { get; set; }
        public virtual AgenteMedicaoModel? AgenteMedicao { get; set; }
    }
}
