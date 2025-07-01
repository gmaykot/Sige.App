using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Geral.FaturaEnergia;

namespace SIGE.Services.Interfaces.Geral
{
    public interface IFaturaEnergiaService : IBaseInterface<FaturaEnergiaDto>
    {
        Task<Response> ObterFaturas(DateOnly? mesReferencia, Guid? pontoMedicaoId);
        Task<Response> ObterDescontosTusdRetusd(DateTime mesReferencia, Guid pontoMedicaoId);
    }
}
