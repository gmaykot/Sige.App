using SIGE.Core.Enumerators;

namespace SIGE.Core.Models.Dto.Gerencial.Empresa
{
    public class PontoMedicaoDto
    {
        public Guid Id { get; set; }
        public required string Nome { get; set; }
        public required string Codigo { get; set; }
        public required bool AcumulacaoLiquida { get; set; } = false;
        public bool Ativo { get; set; }

        public required ETipoSegmento Segmento { get; set; }
        public required ETipoConexao Conexao { get; set; }
        public required ETipoEnergia TipoEnergia { get; set; }

        public Guid? ConcessionariaId { get; set; }
        public string? DescConcessionaria { get; set; }

        public Guid AgenteMedicaoId { get; set; }
        public string? DescAgenteMedicao { get; set; }
    }
}
