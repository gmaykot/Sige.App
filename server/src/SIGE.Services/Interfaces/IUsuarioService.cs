using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Usuario;

namespace SIGE.Services.Interfaces
{
    public interface IUsuarioService : IBaseInterface<UsuarioDto>
    {
        Task<Response> AlterarSenha(UsuarioSenhaDto req);
    }
}
