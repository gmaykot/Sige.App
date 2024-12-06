namespace SIGE.Core.Models.Dto.Administrativo.OAuth2
{
    public class UsuarioOAuth2Dto
    {
        public Guid UsuarioId { get; set; }
        public string Apelido { get; set; } = string.Empty;
        public bool SysAdm { get; set; } = false;
    }
}
