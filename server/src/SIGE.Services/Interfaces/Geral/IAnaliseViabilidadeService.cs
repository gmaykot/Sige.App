using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Gerencial.Concessionaria;

namespace SIGE.Services.Interfaces.Geral
{
    public interface IAnaliseViabilidadeService
    {
        Task<Response> CalcularAnalise(AnaliseViabilidadeDto req);
    }
}
