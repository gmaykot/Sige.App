using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Sistema.Administrativo;

namespace SIGE.Core.Models.Sistema.Externo
{
    public class CredencialCceeModel : BaseModel
    {
        public required string Nome { get; set; }
        public required string AuthUsername { get; set; }
        public required string AuthPassword { get; set; }
        public Guid GestorId { get; set; }
        public virtual GestorModel? Gestor { get; set; }
    }
}
