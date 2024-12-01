using SIGE.Core.Models.Defaults;

namespace SIGE.Core.Models.Sistema.Administrativo
{
    public class GestorModel : BaseModel
    {
        public required string Nome { get; set; }
        public required string NomeFantasia { get; set; }
        public required string CNPJ { get; set; }
        public required string Telefone { get; set; }
        public required string EmailContato { get; set; }
    }
}
