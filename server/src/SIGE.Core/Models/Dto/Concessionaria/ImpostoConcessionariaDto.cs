namespace SIGE.Core.Models.Dto.Concessionaria
{
    public class ImpostoConcessionariaDto
    {
        public Guid Id { get; set; }
        public Guid ConcessionariaId { get; set; }
        public string? DescConcessionaria { get; set; }
        public required double ValorPis { get; set; }
        public required double ValorCofins { get; set; }
        public required DateTime Competencia { get; set; }
    }
}
