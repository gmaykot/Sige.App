using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Administrativo;

namespace SIGE.Services.Interfaces.Administrativo
{
    public interface IMenuUsuarioService : IBaseInterface<MenuUsuarioDto>
    {
        Task<Response> ObterPorUsuario(Guid Id);
        Task<Response> IncluirMenus(MenuUsuarioDto[] menusUsuario);
    }
}
