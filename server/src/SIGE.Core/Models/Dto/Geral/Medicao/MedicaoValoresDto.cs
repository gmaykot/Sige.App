namespace SIGE.Core.Models.Dto.Geral.Medicao
{
    public class MedicaoValoresDto
    {
        public required Guid Id { get; set; }
        public required decimal Icms { get; set; }
        public required decimal Proinfa { get; set; }
    }
}
