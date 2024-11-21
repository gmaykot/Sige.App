using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Sistema.Empresa;

namespace SIGE.Core.Models.Sistema.Fornecedor
{
    public class ContatoModel : BaseModel
    {
        public required string Nome { get; set; }
        public required string Email { get; set; }
        public string? Telefone { get; set; }
        public string? Cargo { get; set; }
        public bool RecebeEmail { get; set; } = false;
        public Guid? FornecedorId { get; set; }
        public virtual FornecedorModel? Fornecedor { get; set; }
        public Guid? EmpresaId { get; set; }
        public virtual EmpresaModel? Empresa { get; set; }
    }
}
