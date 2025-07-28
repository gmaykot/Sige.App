namespace SIGE.Core.Models.Dto.Geral.RelatorioMedicao
{
    public class ValoresMedicaoAnaliticoDto
    {
        public string NumCnpj { get; set; }
        public string DescEmpresa { get; set; }
        public string DescEndereco { get; set; }
        public decimal Quantidade { get; set; }
        public string Unidade { get; set; } = "MWh";
        public decimal? ValorUnitario { get; set; }
        public decimal? ValorICMS { get; set; }
        public decimal? ValorProduto { get; set; }
        public decimal? ValorNota { get; set; }
        public decimal? ComprarCurtoPrazo { get; set; }
        public decimal? VenderCurtoPrazo { get; set; }

        public RelatorioMedicaoDto? RelatorioMedicao { get; set; }
    }
}
