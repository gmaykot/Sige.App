using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Geral.Medicao;

namespace SIGE.Services.Interfaces.Geral
{
    public interface IMedicaoService
    {
        Task<Response> IncluirValores(MedicaoValoresDto req);
        Task<Response> CalcularMedicao(MedicaoDto req);
        Task<Response> ColetarMedicoes(ColetaMedicaoDto req);
        Task<Response> ListarMedicoes(MedicaoDto req);
        Task<Response> ListaMedicoesPorContrato(Guid contratoId, DateTime periodoMedicao);
        Task<Response> ObterAgentes(Guid empresaId);
        Task<Response> ObterPontos(Guid agenteId);
        Task<Response> ObterMedicoes(MedicaoDto req);
    }
}
