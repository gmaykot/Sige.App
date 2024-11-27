namespace SIGE.Core.Models.Dto.Geral.Medicao
{
    public class ResultadoRelatorioMedicaoDto
    {
        public required double ValorProduto { get; set; }
        public required double FaturarLongoPrazo { get; set; }
        public required double ComprarCurtoPrazo { get; set; }
        public required double VenderCurtoPrazo { get; set; }
        public required double TakeMinimo { get; set; }
        public required double TakeMaximo { get; set; }
        public required bool DentroTake { get; set; }
        public required double ValorPerdas { get; set; }
        public required double ValorConsumoTotal { get; set; }
        public FaturamentoRelatorioMedicaoDto? Faturamento { get; set; }
    }
}
