using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Administrativo.Usuario;
using SIGE.Core.Models.Requests;

namespace SIGE.Services.Interfaces.Administrativo
{
    public interface IOAuth2Service
    {
        Task<TokenDto> Introspect(Guid req);
        Task<Response> Login(LoginRequest req);
        Task<bool> Logout();
    }
}
