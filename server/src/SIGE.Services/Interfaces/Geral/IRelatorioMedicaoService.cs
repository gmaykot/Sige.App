using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Geral.RelatorioMedicao;
using SIGE.Core.Models.Requests;

namespace SIGE.Services.Interfaces.Geral
{
    public interface IRelatorioMedicaoService
    {
        Task<Response> ListarRelatorios(RelatorioMedicaoRequest req);
        Task<Response> Obter(Guid contratoId, DateTime mesReferencia);
        Task<Response> ObterFinal(Guid contratoId, DateTime mesReferencia);
        Task<Response> Alterar(RelatorioMedicaoDto req);
    }
}
