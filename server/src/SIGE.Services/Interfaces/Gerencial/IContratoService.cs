using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Gerencial.Contrato;
using SIGE.Core.Models.Sistema.Gerencial.Contrato;

namespace SIGE.Services.Interfaces.Gerencial
{
    public interface IContratoService : IBaseInterface<ContratoDto, ContratoModel>
    {
        Task<Response> IncluirEmpresaGrupo(ContratoEmpresaDto req);
        Task<Response> ExcluirEmpresaGrupo(Guid Id);
    }
}
