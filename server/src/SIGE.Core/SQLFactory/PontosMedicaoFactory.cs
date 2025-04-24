using System.Text;

namespace SIGE.Core.SQLFactory
{
    public class PontosMedicaoFactory
    {
        public static string ObterDropDownComSegmento()
        {
            StringBuilder builder = new StringBuilder();
            builder.Append("SELECT ");
            builder.Append("    ponto.Id, ");
            builder.Append("    ponto.Nome AS 'Descricao', ");
            builder.Append("    CAST(ponto.segmento AS CHAR) AS 'Obs' ");
            builder.Append("FROM PontosMedicao ponto ");
            builder.Append("ORDER BY ponto.Nome");
            return builder.ToString();
        }
    }
}
