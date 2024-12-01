namespace SIGE.Core.Models.Dto.Administrativo.Usuario
{
    public class UsuarioSenhaDto
    {
        public Guid? Id { get; set; }
        public required string NovaSenha { get; set; }
        public required string SenhaAntiga { get; set; }
    }
}
