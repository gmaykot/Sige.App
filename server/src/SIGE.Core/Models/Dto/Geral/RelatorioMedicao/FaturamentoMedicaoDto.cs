namespace SIGE.Core.Models.Dto.Geral.RelatorioMedicao
{
    public class FaturamentoMedicaoDto
    {
        public string Faturamento { get; set; }
        public decimal Quantidade { get; set; }
        public string Unidade { get; set; }
        public decimal? ValorUnitario { get; set; }
        public decimal? ValorICMS { get; set; }
        public decimal? ValorProduto { get; set; }
        public decimal? ValorNota { get; set; }
    }
}
