using SIGE.Core.Models.Defaults;

namespace SIGE.Core.Models.Sistema.Administrativo {

    public class UsuarioModel : BaseModel {
        public string Nome { get; set; }
        public string Apelido { get; set; }
        public string Email { get; set; }
        public byte[] PasswordHash { get; set; }
        public byte[] PasswordSalt { get; set; }
        public bool SysAdm { get; set; } = false;
        public IEnumerable<MenuUsuarioModel>? MenusUsuario { get; set; }
    }
}