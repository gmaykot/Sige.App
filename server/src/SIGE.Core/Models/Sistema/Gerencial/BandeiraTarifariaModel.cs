using SIGE.Core.Models.Defaults;

namespace SIGE.Core.Models.Sistema.Gerencial
{
    public class BandeiraTarifariaModel : BaseModel
    {
        public required double ValorBandeiraVerde { get; set; }
        public required double ValorBandeiraAmarela { get; set; }
        public required double ValorBandeiraVermelha1 { get; set; }
        public required double ValorBandeiraVermelha2 { get; set; }
        public required DateTime VigenciaInicial { get; set; }
        public DateTime? VigenciaFinal { get; set; }
    }
}
