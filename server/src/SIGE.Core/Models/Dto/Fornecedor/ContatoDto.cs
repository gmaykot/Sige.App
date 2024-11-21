namespace SIGE.Core.Models.Dto.Fornecedor
{
    public class ContatoDto
    {
        public Guid? Id { get; set; }
        public Guid? FornecedorId { get; set; }
        public Guid? EmpresaId { get; set; }
        public required string Nome { get; set; }
        public required string Email { get; set; }
        public string? Telefone { get; set; }
        public string? Cargo { get; set; }
        public bool RecebeEmail { get; set; } = true;

    }
}
