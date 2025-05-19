using SIGE.Core.Models.Defaults;

namespace SIGE.Services.Interfaces.Geral
{
    public interface IRelatorioEconomiaService
    {
        Task<Response> ListarRelatorios(DateOnly? mesReferencia);
        Task<Response> ObterFinal(Guid pontoMedicaoId, DateOnly mesReferencia);
        Task<Response> ObterFinalPdf(Guid pontoMedicaoId, DateOnly mesReferencia);
    }
}
