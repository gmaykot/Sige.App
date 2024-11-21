using SIGE.Core.Models.Defaults;

namespace SIGE.Core.Models.Sistema.Ccee
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
