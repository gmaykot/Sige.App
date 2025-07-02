using System.Text;

namespace SIGE.Core.SQLFactory
{
    public class ConcessionariasFactory
    {
        public static string ConcessionariasPorPontoMedicao(Guid pontoMedicaoId)
        {
            StringBuilder builder = new();

            builder.AppendLine("SELECT");
            builder.AppendLine("    concessionaria.Id,");
            builder.AppendLine("    concessionaria.Nome AS 'Descricao',");
            builder.AppendLine("    NULL AS 'Obs'");
            builder.AppendLine("FROM PontosMedicao ponto");
            builder.AppendLine("JOIN Concessionarias concessionaria ON concessionaria.Id = ponto.ConcessionariaId");
            builder.AppendLine("WHERE ponto.Id = '@PontosMedicaoId'");
            builder.AppendLine("    AND ponto.DataExclusao IS NULL");

            string query = builder.ToString()
                .Replace("@PontosMedicaoId", pontoMedicaoId.ToString());

            return query;

        }
    }
}
