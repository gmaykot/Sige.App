namespace SIGE.Core.Models.Dto.Fornecedor
{
    public class FornecedorDto
    {
        public Guid Id { get; set; }
        public required string Nome { get; set; }
        public required string CNPJ { get; set; }
        public string? TelefoneContato { get; set; }
        public string? TelefoneAlternativo { get; set; }
        public Guid GestorId { get; set; }
        public IEnumerable<ContatoDto>? Contatos { get; set; }
    }
}
