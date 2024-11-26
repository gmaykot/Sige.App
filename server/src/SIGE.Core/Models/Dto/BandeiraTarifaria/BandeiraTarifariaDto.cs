namespace SIGE.Core.Models.Dto.BandeiraTarifaria
{
    public class BandeiraTarifariaDto
    {
        public Guid Id { get; set; }
        public required double ValorBandeiraVerde { get; set; }
        public required double ValorBandeiraAmarela { get; set; }
        public required double ValorBandeiraVermelha1 { get; set; }
        public required double ValorBandeiraVermelha2 { get; set; }
        public required DateTime DataVigenciaInicial { get; set; }
        public DateTime? DataVigenciaFinal { get; set; }
    }
}
