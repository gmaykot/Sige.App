using SIGE.Core.Models.Defaults;

namespace SIGE.Core.Models.Sistema.Administrativo
{
    public class UsuarioModel : BaseModel
    {
        public required string Nome { get; set; }
        public required string Apelido { get; set; }
        public required string Email { get; set; }
        public required byte[] PasswordHash { get; set; }
        public required byte[] PasswordSalt { get; set; }
        public Guid GestorId { get; set; }
        public required bool SuperUsuario { get; set; } = false;
        public virtual GestorModel? Gestor { get; set; }
        public IEnumerable<MenuUsuarioModel>? MenusUsuario { get; set; }
    }
}
