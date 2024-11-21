namespace SIGE.Core.Models.Dto.Contrato
{
    public class ContratoEmpresaDto
    {
        public Guid? Id { get; set; }
        public Guid? ContratoId { get; set; }
        public Guid? EmpresaId { get; set; }
        public string? DscEmpresa { get; set; }
        public string? CnpjEmpresa { get; set; }
    }
}
