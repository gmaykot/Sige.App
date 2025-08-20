using SIGE.Core.Models.Defaults;

namespace SIGE.Core.Models.Sistema.Administrativo {
    public class TokenModel : BaseModel {
        public required Guid UsuarioId { get; set; }
        public required Guid GestorId { get; set; }
        public required DateTime DataExpiracao { get; set; }

        public virtual UsuarioModel? Usuario { get; set; }
    }
}
