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
    }
}
