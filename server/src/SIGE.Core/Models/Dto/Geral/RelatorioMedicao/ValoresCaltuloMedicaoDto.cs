namespace SIGE.Core.Models.Dto.Geral.RelatorioMedicao
{
    public class ValoresCaltuloMedicaoDto
    {
        public decimal? ValorProduto { get; set; }
        public decimal? FaturarLongoPrazo { get; set; }
        public decimal? ComprarCurtoPrazo { get; set; }
        public decimal? VenderCurtoPrazo { get; set; }
        public decimal? TakeMinimo { get; set; }
        public decimal? TakeMaximo { get; set; }
        public bool DentroTake { get; set; }
        public decimal? ValorPerdas { get; set; }
        public decimal? ValorConsumoTotal { get; set; }
        public FaturamentoMedicaoDto ResultadoFaturamento { get; set; }
    }
}
