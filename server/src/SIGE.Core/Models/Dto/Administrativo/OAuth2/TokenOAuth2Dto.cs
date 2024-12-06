namespace SIGE.Core.Models.Dto.Administrativo.OAuth2
{
    public class TokenOAuth2Dto
    {
        public Guid Token { get; set; }
        public Guid? RefreshToken { get; set; }
    }
}
