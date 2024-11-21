using SIGE.Core.Enumerators;
using SIGE.Core.Models.Dto.Menus;

namespace SIGE.Core.Models.Dto.Usuario
{
    public class UsuarioDto
    {
        public Guid? Id { get; set; }
        public required string Nome { get; set; }
        public required string Apelido { get; set; }
        public required string Email { get; set; }
        public string? Senha { get; set; }
        public ETipoPerfil TipoPerfil { get; set; }
        public bool Ativo { get; set; }
        public IEnumerable<MenuUsuarioDto>? MenusUsuario { get; set; }
    }
}
