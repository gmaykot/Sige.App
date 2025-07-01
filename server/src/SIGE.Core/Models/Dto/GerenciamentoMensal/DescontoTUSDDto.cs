namespace SIGE.Core.Models.Dto.GerenciamentoMensal
{
    public class DescontoTUSDDto
    {
        public Guid? Id { get; set; }
        public DateOnly? MesReferencia { get; set; }
        public Guid AgenteMedicaoId { get; set; }
        public string? DescAgenteMedicao { get; set; }
        public string? CodPerfil { get; set; }
        public double? ValorDescontoTUSD { get; set; }
        public double? ValorDescontoRETUSD { get; set; }
        public int? EmpresasVinculadas { get; set; }
    }
}
