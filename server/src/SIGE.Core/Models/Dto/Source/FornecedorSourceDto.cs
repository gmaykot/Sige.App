namespace SIGE.Core.Models.Dto.Source {
    public class FornecedorSourceDto {
        public Guid? Id { get; set; }
        public string? Nome { get; set; }
        public string? CNPJ { get; set; }
        public string? TelefoneContato { get; set; }
        public string? TelefoneAlternativo { get; set; }
        public bool? Ativo { get; set; }
    }
}
