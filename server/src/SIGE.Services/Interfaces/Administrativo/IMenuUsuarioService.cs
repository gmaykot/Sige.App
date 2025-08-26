using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Administrativo;
using SIGE.Core.Models.Sistema.Administrativo;

namespace SIGE.Services.Interfaces.Administrativo
{
    public interface IMenuUsuarioService : IBaseInterface<MenuUsuarioDto, MenuUsuarioModel>
    {
        Task<Response> ObterPorUsuario(Guid Id);
        Task<Response> IncluirMenus(MenuUsuarioDto[] menusUsuario);
    }
}
