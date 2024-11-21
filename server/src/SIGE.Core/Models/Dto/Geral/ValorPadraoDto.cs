using SIGE.Core.Enumerators;

namespace SIGE.Core.Models.Dto.Geral
{
    public class ValorPadraoDto
    {
        public Guid? Id { get; set; }
        public required DateTime Competencia { get; set; }
        public required decimal ValorPis { get; set; }
        public required decimal ValorCofins { get; set; }
        public required string Bandeira { get; set; }
        public required decimal ValorBandeira { get; set; }
    }
}
