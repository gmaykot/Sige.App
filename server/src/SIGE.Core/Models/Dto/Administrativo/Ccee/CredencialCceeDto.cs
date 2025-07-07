namespace SIGE.Core.Models.Dto.Administrativo.Ccee {
    public class CredencialCceeDto {
        public Guid? Id { get; set; }
        public required string AuthUsername { get; set; }
        public required string AuthPassword { get; set; }
        public required string CodigoPonto { get; set; }
        public required string AuthCodigoPerfilAgente { get; set; }
        public required Guid EmpresaId { get; set; }
        public required Guid CceeId { get; set; }
    }
}
