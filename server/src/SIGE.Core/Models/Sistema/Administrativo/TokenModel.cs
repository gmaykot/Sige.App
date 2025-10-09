using SIGE.Core.Models.Defaults;

namespace SIGE.Core.Models.Sistema.Administrativo {

    public class TokenModel : BaseModel {
        public Guid UsuarioId { get; set; }
        public DateTime DataExpiracao { get; set; }

        public virtual UsuarioModel? Usuario { get; set; }
    }
}