namespace SIGE.Core.Models.Dto.Gerencial.Empresa
{
    public class AgenteMedicaoDto
    {
        public Guid Id { get; set; }
        public Guid EmpresaId { get; set; }
        public required string Nome { get; set; }
        public required string CodigoPerfilAgente { get; set; }
        public IEnumerable<PontoMedicaoDto>? PontosMedicao { get; set; }
        public bool Ativo { get; set; }
    }
}
