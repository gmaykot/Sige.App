using SIGE.Core.Enumerators;
using SIGE.Core.Models.Defaults;

namespace SIGE.Core.Models.Sistema.Geral
{
    public class ValorPadraoModel : BaseModel
    {
        public required DateTime Competencia { get; set; }
        public required decimal ValorPis { get; set; }
        public required decimal ValorCofins { get; set; }
        public required ETipoBandeira Bandeira { get; set; }
        public required decimal ValorBandeira { get; set; }
    }
}
