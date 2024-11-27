using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Gerencial.Contrato;

namespace SIGE.Services.Interfaces.Gerencial
{
    public interface IContratoService : IBaseInterface<ContratoDto>
    {
        Task<Response> ObterDropDown();
        Task<Response> IncluirEmpresaGrupo(ContratoEmpresaDto req);
        Task<Response> ExcluirEmpresaGrupo(Guid Id);
    }
}
