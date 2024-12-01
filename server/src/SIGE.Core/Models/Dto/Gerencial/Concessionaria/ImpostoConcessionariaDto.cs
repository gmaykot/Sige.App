namespace SIGE.Core.Models.Dto.Gerencial.Concessionaria
{
    public class ImpostoConcessionariaDto
    {
        public Guid Id { get; set; }
        public Guid ConcessionariaId { get; set; }
        public string? DescConcessionaria { get; set; }
        public required double ValorPis { get; set; }
        public required double ValorCofins { get; set; }
        public required DateTime MesReferencia { get; set; }
    }
}
