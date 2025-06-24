using System.Text;

namespace SIGE.Core.SQLFactory
{
    public class ConcessionariasFactory
    {
        public static string ConcessionariasPorPontoMedicao(Guid pontoMedicaoId)
        {
            StringBuilder builder = new StringBuilder();
            builder.Append("SELECT ");
            builder.Append("    concessionaria.Id, ");
            builder.Append("    concessionaria.Nome AS 'Descricao', ");
            builder.Append("    null AS 'Obs' ");
            builder.Append("FROM PontosMedicao ponto ");
            builder.Append("JOIN Concessionarias concessionaria ON concessionaria.Id = ponto.ConcessionariaId ");
            builder.Append(string.Format("WHERE ponto.Id = '{0}' ", pontoMedicaoId));
            return builder.ToString();
        }
    }
}
