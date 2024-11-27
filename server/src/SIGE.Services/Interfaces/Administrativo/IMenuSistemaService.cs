using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Administrativo;

namespace SIGE.Services.Interfaces.Administrativo
{
    public interface IMenuSistemaService : IBaseInterface<MenuSistemaDto>
    {
        Task<Response> ObterEstruturtado();
        Task<Response> ObterDropDown();
        Task<Response> ObterDropDownEstruturado();
    }
}
