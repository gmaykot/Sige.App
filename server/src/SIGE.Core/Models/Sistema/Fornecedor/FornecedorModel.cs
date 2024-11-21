using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Sistema.Contrato;

namespace SIGE.Core.Models.Sistema.Fornecedor
{
    public class FornecedorModel : BaseModel
    {
        public required string Nome { get; set; }
        public required string CNPJ { get; set; }
        public string? TelefoneContato { get; set; }
        public string? TelefoneAlternativo { get; set; }
        public Guid GestorId { get; set; }
        public virtual GestorModel? Gestor { get; set; }
        public virtual IEnumerable<ContatoModel>? Contatos { get; set; }
        public virtual IEnumerable<ContratoModel>? Contratos { get; set; }
    }
}
