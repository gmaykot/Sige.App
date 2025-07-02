using System.Text;

namespace SIGE.Core.SQLFactory
{
    public class PontosMedicaoFactory
    {
        public static string ObterDropDownComSegmento()
        {
            StringBuilder builder = new();

            builder.AppendLine("SELECT");
            builder.AppendLine("    ponto.Id,");
            builder.AppendLine("    ponto.Nome AS 'Descricao',");
            builder.AppendLine("    CAST(ponto.segmento AS CHAR) AS 'Obs'");
            builder.AppendLine("FROM PontosMedicao ponto");
            builder.AppendLine("WHERE ponto.DataExclusao IS NULL");
            builder.AppendLine("ORDER BY ponto.Nome");

            string query = builder.ToString();

            return query;
        }
    }
}
