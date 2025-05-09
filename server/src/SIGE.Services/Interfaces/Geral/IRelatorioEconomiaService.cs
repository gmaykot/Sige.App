using SIGE.Core.Models.Defaults;

namespace SIGE.Services.Interfaces.Geral
{
    public interface IRelatorioEconomiaService
    {
        Task<Response> ObterFinal(Guid contratoId, DateTime mesReferencia);

    }
}
