namespace SIGE.Core.Models.Dto.Gerencial
{
    public class BandeiraTarifariaDto
    {
        public Guid Id { get; set; }
        public required double ValorBandeiraVerde { get; set; }
        public required double ValorBandeiraAmarela { get; set; }
        public required double ValorBandeiraVermelha1 { get; set; }
        public required double ValorBandeiraVermelha2 { get; set; }
        public required DateTime VigenciaInicial { get; set; }
        public DateTime? VigenciaFinal { get; set; }
    }
}
