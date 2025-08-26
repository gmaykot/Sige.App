namespace SIGE.Core.Models.Dto.Geral.RelatorioEconomia
{
    public class RelatorioEconomiaListDto
    {
        public Guid? Id { get; set; }
        public Guid? PontoMedicaoId { get; set; }
        public Guid? ContratoId { get; set; }
        public string? DescPontoMedicao { get; set; }
        public string? DescConcessionaria { get; set; }
        public DateTime? MesReferencia { get; set; }
        public DateTime? DataVencimento { get; set; }
        public bool? Validado { get; set; }
    }
}
