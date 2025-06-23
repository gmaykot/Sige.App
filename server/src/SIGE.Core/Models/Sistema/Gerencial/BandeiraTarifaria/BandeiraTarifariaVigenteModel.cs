using SIGE.Core.Enumerators;
using SIGE.Core.Models.Defaults;

namespace SIGE.Core.Models.Sistema.Gerencial.BandeiraTarifaria
{
    public class BandeiraTarifariaVigenteModel : BaseModel
    {
        public DateTime MesReferencia { get; set; }
        public ETipoBandeira Bandeira { get; set; }
        public Guid BandeiraTarifariaId { get; set; }
        public BandeiraTarifariaModel? BandeiraTarifaria { get; set; }

        public double ValorBandeira() => Bandeira switch
        {
            ETipoBandeira.VERDE => BandeiraTarifaria.ValorBandeiraVerde,
            ETipoBandeira.AMARELA => BandeiraTarifaria.ValorBandeiraAmarela,
            ETipoBandeira.VERMELHA_1 => BandeiraTarifaria.ValorBandeiraVermelha1,
            ETipoBandeira.VERMELHA_2 => BandeiraTarifaria.ValorBandeiraVermelha2,
            _ => 0
        };
    }
}
