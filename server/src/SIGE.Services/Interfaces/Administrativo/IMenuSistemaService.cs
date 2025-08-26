using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Administrativo;
using SIGE.Core.Models.Sistema.Administrativo;

namespace SIGE.Services.Interfaces.Administrativo
{
    public interface IMenuSistemaService : IBaseInterface<MenuSistemaDto, MenuSistemaModel>
    {
        Task<Response> ObterEstruturtado();
        Task<Response> ObterDropDownEstruturado();
    }
}
