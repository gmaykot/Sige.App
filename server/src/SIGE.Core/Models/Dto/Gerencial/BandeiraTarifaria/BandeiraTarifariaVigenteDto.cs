using SIGE.Core.Enumerators;

namespace SIGE.Core.Models.Dto.Gerencial.BandeiraTarifaria
{
    public class BandeiraTarifariaVigenteDto
    {
        public Guid? Id { get; set; }
        public DateTime? MesReferencia { get; set; }
        public ETipoBandeira? Bandeira { get; set; }
        public Guid BandeiraTarifariaId { get; set; }
    }
}
