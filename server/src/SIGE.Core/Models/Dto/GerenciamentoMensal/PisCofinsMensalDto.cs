namespace SIGE.Core.Models.Dto.GerenciamentoMensal
{
    public class PisCofinsMensalDto
    {
        public Guid? Id { get; set; }
        public DateOnly? MesReferencia { get; set; }
        public Guid ConcessionariaId { get; set; }
        public string? DescConcessionaria { get; set; }
        public double? Pis { get; set; }
        public double? Cofins { get; set; }
    }
}
