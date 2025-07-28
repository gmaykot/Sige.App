namespace SIGE.Core.Models.Dto.Geral
{
    public class FaturamentoCoenelDto
    {
        public required Guid? Id { get; set; }
        public required Guid? EmpresaId { get; set; }
        public required Guid? PontoMedicaoId { get; set; }
        public required Guid? AgenteMedicaoId { get; set; }

        public string? DescEmpresa { get; set; }
        public string? DescPontoMedicao { get; set; }
        public string? DescAgenteMedicao { get; set; }

        public required DateTime VigenciaInicial { get; set; }
        public DateTime? VigenciaFinal { get; set; }

        public required double ValorFixo { get; set; }
        public required double QtdeSalarios { get; set; }
        public required double Porcentagem { get; set; }        
    }
}
