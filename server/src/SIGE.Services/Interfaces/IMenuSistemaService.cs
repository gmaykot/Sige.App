using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Menus;

namespace SIGE.Services.Interfaces
{
    public interface IMenuSistemaService : IBaseInterface<MenuSistemaDto>
    {
        Task<Response> ObterEstruturtado();
        Task<Response> ObterDropDown();
        Task<Response> ObterDropDownEstruturado();
    }
}
