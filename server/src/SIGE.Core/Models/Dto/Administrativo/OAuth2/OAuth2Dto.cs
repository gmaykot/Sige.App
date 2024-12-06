namespace SIGE.Core.Models.Dto.Administrativo.OAuth2
{
    public class OAuth2Dto
    {
        public required TokenOAuth2Dto Auth { get; set; }
        public required UsuarioOAuth2Dto Usuario { get; set; }
        public required List<MenuSistemaDto> Menus { get; set; }
    }
}
