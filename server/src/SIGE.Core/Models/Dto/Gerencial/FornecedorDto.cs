namespace SIGE.Core.Models.Dto.Gerencial {

    public class FornecedorDto {
        public Guid Id { get; set; }
        public string Nome { get; set; }
        public string CNPJ { get; set; }
        public string? TelefoneContato { get; set; }
        public string? TelefoneAlternativo { get; set; }
        public IEnumerable<ContatoDto>? Contatos { get; set; }
        public bool? Ativo { get; set; }
    }
}