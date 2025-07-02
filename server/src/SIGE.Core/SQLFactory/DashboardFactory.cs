using SIGE.Core.Extensions;
using System.Text;

namespace SIGE.Core.SQLFactory
{
    public class DashboardFactory
    {
        public static string ContratosFimVigencia(DateTime mesReferencia)
        {
            StringBuilder builder = new();

            builder.AppendLine("SELECT");
            builder.AppendLine("    contrato.Numero AS 'NumContrato',");
            builder.AppendLine("    contrato.DscGrupo AS 'DescGrupoEmpresas',");
            builder.AppendLine("    contrato.DataVigenciaInicial AS 'VigenciaInicial',");
            builder.AppendLine("    contrato.DataVigenciaFinal AS 'VigenciaFinal'");
            builder.AppendLine("FROM");
            builder.AppendLine("    Contratos contrato");
            builder.AppendLine("WHERE");
            builder.AppendLine("    MONTH(contrato.DataVigenciaFinal) = @Mes");
            builder.AppendLine("    AND YEAR(contrato.DataVigenciaFinal) = @Ano");
            builder.AppendLine("    AND contrato.Ativo = true");
            builder.AppendLine("    AND contrato.DataExclusao IS NULL");
            builder.AppendLine("ORDER BY");
            builder.AppendLine("    contrato.DataVigenciaFinal,");
            builder.AppendLine("    contrato.DscGrupo");

            string query = builder.ToString()
                .Replace("@Mes", mesReferencia.Month.ToString())
                .Replace("@Ano", mesReferencia.Year.ToString());

            return query;

        }

        public static string FaturamentoCoenel(DateTime mesReferencia)
        {
            StringBuilder builder = new();

            builder.AppendLine("SELECT COUNT(*) AS 'Total'");
            builder.AppendLine("FROM FaturamentosCoenel faturamento");
            builder.AppendLine("WHERE");
            builder.AppendLine("    MONTH(faturamento.VigenciaFinal) = @Mes");
            builder.AppendLine("    AND YEAR(faturamento.VigenciaFinal) = @Ano");
            builder.AppendLine("    AND faturamento.Ativo = true");
            builder.AppendLine("    AND faturamento.DataExclusao IS NULL");

            string query = builder.ToString()
                .Replace("@Mes", mesReferencia.Month.ToString())
                .Replace("@Ano", mesReferencia.Year.ToString());

            return query;

        }

        public static string ColetaMedicoes(DateTime mesReferencia, bool agrupado = false)
        {
            StringBuilder builder = new();

            builder.AppendLine("SELECT COUNT(*) AS 'Total'@AgrupamentoStatus");
            builder.AppendLine("FROM ConsumosMensais consumo");
            builder.AppendLine("WHERE");
            builder.AppendLine("    MONTH(consumo.MesReferencia) = @MesAnterior");
            builder.AppendLine("    AND consumo.Ativo = true");
            builder.AppendLine("    AND consumo.DataExclusao IS NULL");

            if (agrupado)
            {
                builder.AppendLine("GROUP BY consumo.StatusMedicao");
            }

            builder.AppendLine("ORDER BY consumo.StatusMedicao");

            string query = builder.ToString()
                .Replace("@MesAnterior", (mesReferencia.Month - 1).ToString())
                .Replace("@AgrupamentoStatus", agrupado ? ", consumo.StatusMedicao AS 'Status'" : "");

            return query;

        }

        public static string ConsumoMeses(DateTime mesReferencia, int meses)
        {
            var dataInicio = mesReferencia.AddMonths(meses * -1).GetPrimeiraHoraMes();
            var dataFim = mesReferencia.GetUltimaHoraMes();

            StringBuilder builder = new();

            builder.AppendLine("SELECT");
            builder.AppendLine("    ROUND(SUM(medicao.ConsumoAtivo), 2) AS 'ConsumoMensal',");
            builder.AppendLine("    CONCAT(MONTH(consumo.MesReferencia), '/', YEAR(consumo.MesReferencia)) AS 'DescMes'");
            builder.AppendLine("FROM ConsumosMensais consumo");
            builder.AppendLine("INNER JOIN Medicoes medicao ON medicao.ConsumoMensalId = consumo.Id");
            builder.AppendLine("WHERE");
            builder.AppendLine("    medicao.SubTipo = 'L'");
            builder.AppendLine("    AND medicao.Status = 'HCC'");
            builder.AppendLine("    AND consumo.MesReferencia > '@DataInicio'");
            builder.AppendLine("    AND consumo.MesReferencia <= '@DataFim'");
            builder.AppendLine("    AND consumo.Ativo = true");
            builder.AppendLine("    AND consumo.DataExclusao IS NULL");
            builder.AppendLine("GROUP BY consumo.MesReferencia");
            builder.AppendLine("ORDER BY consumo.MesReferencia");

            string query = builder.ToString()
                .Replace("@DataInicio", dataInicio.ToString("yyyy-MM-dd"))
                .Replace("@DataFim", dataFim.ToString("yyyy-MM-dd"));

            return query;

        }

        public static string BandeirasVigentes(DateTime mesReferencia)
        {
            StringBuilder builder = new();

            builder.AppendLine("SELECT COUNT(*) AS 'Total'");
            builder.AppendLine("FROM BandeiraTarifariaVigente bandeira");
            builder.AppendLine("WHERE");
            builder.AppendLine("    MONTH(bandeira.MesReferencia) = @MesAnterior");
            builder.AppendLine("    AND bandeira.Ativo = true");
            builder.AppendLine("    AND bandeira.DataExclusao IS NULL");

            string query = builder.ToString()
                .Replace("@MesAnterior", (mesReferencia.Month - 1).ToString());

            return query;

        }
    }
}
