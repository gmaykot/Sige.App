namespace SIGE.Core.Models.Dto.Geral.Medicao
{
    public class FaturamentoRelatorioMedicaoDto
    {
        public string DscFaturamento { get; set; } = "Longo Prazo";
        public double Quantidade { get; set; }
        public string Unidade { get; set; } = "MWh";
        public double ValorICMS { get; set; }
        public double ValorNota { get; set; }
        public double ValorProduto { get; set; }
        public double ValorUnitario { get; set; }
    }
}
