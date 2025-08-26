using SIGE.Core.Models.Defaults;

namespace SIGE.Services.Interfaces
{
    public interface IDashboardService
    {
        Task<Response> ObterChecklist(DateTime mesReferencia);
        Task<Response> ObterContratosFinalizados(DateTime mesReferencia);
        Task<Response> ObterStatusMedicoes(DateTime mesReferencia);
        Task<Response> ObterConsumoMeses(DateTime mesReferencia, int meses);
    }
}
