using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Gerencial.Concessionaria;

namespace SIGE.Calculos.AnaliseViabilidade
{
    public interface ICalculoAnaliseViabilidadeService
    {
        Response CalculaMercadoCativoAzul(CalculoValoresConcessionariaDto valorConcessionaria, AnaliseViabilidadeDto analiseViabilidadeRequest);
        Response CalculaMercadoCativoVerde(CalculoValoresConcessionariaDto valorConcessionaria, AnaliseViabilidadeDto analiseViabilidadeRequest);
        Response CalculaMercadoLivreAzulZero(CalculoValoresConcessionariaDto valorConcessionaria, AnaliseViabilidadeDto analiseViabilidadeRequest);
        Response CalculaMercadoLivreVerdeZero(CalculoValoresConcessionariaDto valorConcessionaria, AnaliseViabilidadeDto analiseViabilidadeRequest);
        Response CalculaMercadoLivreAzulCinquenta(CalculoValoresConcessionariaDto valorConcessionaria, AnaliseViabilidadeDto analiseViabilidadeRequest);
        Response CalculaMercadoLivreVerdeCinquenta(CalculoValoresConcessionariaDto valorConcessionaria, AnaliseViabilidadeDto analiseViabilidadeRequest);
        Response CalculaMercadoLivreAzulCem(CalculoValoresConcessionariaDto valorConcessionaria, AnaliseViabilidadeDto analiseViabilidadeRequest);
        Response CalculaMercadoLivreVerdeCem(CalculoValoresConcessionariaDto valorConcessionaria, AnaliseViabilidadeDto analiseViabilidadeRequest);
    }
}
