namespace SIGE.Core.Models.Dto.GerenciamentoMensal
{
    public class ProinfaIcmsMensalDto
    {
        public DateOnly MesReferencia { get; set; }
        public Guid PontoMedicaoId { get; set; }
        public string? DescPontoMedicao { get; set; }
        public decimal Proinfa { get; set; }
        public decimal Icms { get; set; }
    }
}
