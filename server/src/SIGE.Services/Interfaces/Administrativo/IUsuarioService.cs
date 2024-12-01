using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Administrativo.Usuario;

namespace SIGE.Services.Interfaces.Administrativo
{
    public interface IUsuarioService : IBaseInterface<UsuarioDto>
    {
        Task<Response> AlterarSenha(UsuarioSenhaDto req);
    }
}
