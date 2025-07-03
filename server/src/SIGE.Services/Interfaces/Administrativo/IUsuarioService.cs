using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Administrativo.Usuario;
using SIGE.Core.Models.Sistema.Administrativo;

namespace SIGE.Services.Interfaces.Administrativo
{
    public interface IUsuarioService : IBaseInterface<UsuarioDto, UsuarioModel>
    {
        Task<Response> AlterarSenha(UsuarioSenhaDto req);
    }
}
