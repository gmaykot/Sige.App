namespace SIGE.Core.Models.Dto.RelatorioEconomia
{
    public class ValorAnaliticosEconomiaDto
    {
        public Guid? EmpresaId { get; set; }
        public string? NumCnpj { get; set; }
        public string? DescEmpresa { get; set; }
        public string? DescEndereco{ get; set; }
        public decimal TotalMedido { get; set; }
        public decimal? Proinfa { get; set; }
        public decimal? Icms { get; set; }
    }
}
