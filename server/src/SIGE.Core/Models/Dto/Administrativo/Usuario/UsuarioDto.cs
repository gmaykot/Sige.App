using SIGE.Core.Enumerators;

namespace SIGE.Core.Models.Dto.Administrativo.Usuario
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
        public bool SuperUsuario { get; set; }
        public IEnumerable<MenuUsuarioDto>? MenusUsuario { get; set; }
    }
}
