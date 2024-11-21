namespace SIGE.Core.Models.Dto.Medicao
{
    public class ColetaMedicaoDto
    {
        public DateTime? Periodo { get; set; }
        public IEnumerable<MedicaoDto>? Medicoes { get; set; }
    }
}
