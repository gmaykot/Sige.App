using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Geral.RelatorioEconomia;

namespace SIGE.Services.Interfaces.Gerencial
{
    public interface IEnergiaAcumuladaService : IBaseInterface<EnergiaAcumuladaDto>
    {
        Task<Response> ObterPorPontoMedicao(Guid Id);
        Task<Response> ObterPorMesReferencia(DateTime? MesReferencia);
    }
}
