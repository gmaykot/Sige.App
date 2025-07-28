using SIGE.Core.Enumerators;
using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Sistema.Geral;
using SIGE.Core.Models.Sistema.Geral.Medicao;
using SIGE.Core.Models.Sistema.Gerencial.Concessionaria;

namespace SIGE.Core.Models.Sistema.Gerencial.Empresa {
    public class PontoMedicaoModel : BaseModel {
        public required string Nome { get; set; }
        public required string Codigo { get; set; }
        public required bool AcumulacaoLiquida { get; set; } = false;
        public required bool IncideICMS { get; set; } = true;

        public required ETipoSegmento Segmento { get; set; }
        public required ETipoConexao Conexao { get; set; }
        public required ETipoEnergia TipoEnergia { get; set; }

        public Guid ConcessionariaId { get; set; }
        public ConcessionariaModel? Concessionaria { get; set; }

        public Guid AgenteMedicaoId { get; set; }
        public AgenteMedicaoModel? AgenteMedicao { get; set; }

        public IEnumerable<ConsumoMensalModel>? ConsumosMensal { get; set; }
        public IEnumerable<ValorMensalPontoMedicaoModel>? ValoresMensaisPontoMedicao { get; set; }
    }
}
