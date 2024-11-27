using SIGE.Core.Models.Defaults;

namespace SIGE.Core.Models.Sistema.Gerencial.Concessionaria
{
    public class ImpostoConcessionariaModel : BaseModel
    {
        public Guid ConcessionariaId { get; set; }
        public virtual ConcessionariaModel? Concessionaria { get; set; }
        public required double ValorPis { get; set; }
        public required double ValorCofins { get; set; }
        public required DateTime MesReferencia { get; set; }
    }
}
