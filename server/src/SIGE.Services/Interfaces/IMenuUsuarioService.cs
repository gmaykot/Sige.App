using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Menus;

namespace SIGE.Services.Interfaces
{
    public interface IMenuUsuarioService : IBaseInterface<MenuUsuarioDto>
    {
        Task<Response> ObterDropDown();
    }
}
