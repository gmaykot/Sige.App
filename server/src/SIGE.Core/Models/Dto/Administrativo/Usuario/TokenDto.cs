namespace SIGE.Core.Models.Dto.Administrativo.Usuario
{
    public class TokenDto
    {
        public Guid Id { get; set; }
        public string Payload { get; set; } = string.Empty;
        public string MenusUsuario { get; set; } = string.Empty;
        public Guid UsuarioId { get; set; }
        public Guid GestorId { get; set; }
        public DateTime DataExpiracao { get; set; }
        public bool Ativo { get; set; }
    }
}
