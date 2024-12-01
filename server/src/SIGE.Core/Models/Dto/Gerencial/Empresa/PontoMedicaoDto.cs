namespace SIGE.Core.Models.Dto.Gerencial.Empresa
{
    public class PontoMedicaoDto
    {
        public Guid Id { get; set; }
        public required string Nome { get; set; }
        public required string Codigo { get; set; }
        public Guid AgenteMedicaoId { get; set; }
        public bool Ativo { get; set; }
    }
}
