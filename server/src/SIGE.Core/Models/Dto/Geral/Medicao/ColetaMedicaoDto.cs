namespace SIGE.Core.Models.Dto.Geral.Medicao
{
    public class ColetaMedicaoDto
    {
        public DateOnly Periodo { get; set; }
        public IEnumerable<MedicaoDto>? Medicoes { get; set; }
    }
}
