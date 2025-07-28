namespace SIGE.Core.Models.Dto.Gerencial {
    public class ContatoDto {
        public Guid? Id { get; set; }
        public Guid? FornecedorId { get; set; }
        public Guid? EmpresaId { get; set; }
        public string? Nome { get; set; }
        public string? Email { get; set; }
        public string? Telefone { get; set; }
        public string? Cargo { get; set; }
        public bool? RecebeEmail { get; set; }
        public bool? Ativo { get; set; }
    }
}
