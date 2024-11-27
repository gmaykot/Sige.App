namespace SIGE.Core.Models.Dto.Gerencial.Concessionaria
{
    public class ConcessionariaDto
    {
        public Guid? Id { get; set; }
        public Guid? GestorId { get; set; }
        public required string Nome { get; set; }
        public required string Estado { get; set; }
    }
}
