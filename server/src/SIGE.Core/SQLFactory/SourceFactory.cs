using System.Text;

namespace SIGE.Core.SQLFactory {
    public static class SourceFactory {
        public static string FaturamentosCoenel() {
            var builder = new StringBuilder();

            builder.AppendLine("WITH FaturamentosRanked AS (");
            builder.AppendLine("    SELECT ");
            builder.AppendLine("        faturamento.*,");
            builder.AppendLine("        ROW_NUMBER() OVER (PARTITION BY faturamento.PontoMedicaoId ORDER BY faturamento.VigenciaInicial DESC) AS rn");
            builder.AppendLine("    FROM FaturamentosCoenel faturamento");
            builder.AppendLine($"    WHERE {DefaultFactory.RegistroAtivo("faturamento")}");
            builder.AppendLine(")");
            builder.AppendLine("SELECT ");
            builder.AppendLine("    fr.*,");
            builder.AppendLine("    ponto.Nome AS DescPontoMedicao,");
            builder.AppendLine("    agente.Id AS AgenteMedicaoId,");
            builder.AppendLine("    agente.Nome AS DescAgenteMedicao,");
            builder.AppendLine("    empresa.Id AS EmpresaId,");
            builder.AppendLine("    empresa.NomeFantasia AS DescEmpresa");
            builder.AppendLine("FROM FaturamentosRanked fr");
            builder.AppendLine("INNER JOIN PontosMedicao ponto ON fr.PontoMedicaoId = ponto.Id");
            builder.AppendLine("INNER JOIN AgentesMedicao agente ON ponto.AgenteMedicaoId = agente.Id");
            builder.AppendLine("INNER JOIN Empresas empresa ON agente.EmpresaId = empresa.Id");
            builder.AppendLine("WHERE fr.rn = 1");
            builder.AppendLine("ORDER BY empresa.NomeFantasia ASC, ponto.Nome ASC, fr.VigenciaFinal DESC");

            string query = builder.ToString();

            return query;
        }

        public static string TarifasAplicacao() {
            var builder = new StringBuilder();

            builder.AppendLine("SELECT");
            builder.AppendLine("    tarifa.Id,");
            builder.AppendLine("    tarifa.ConcessionariaId,");
            builder.AppendLine("    concessionaria.Nome AS DescConcessionaria,");
            builder.AppendLine("    tarifa.NumeroResolucao,");
            builder.AppendLine("    tarifa.SubGrupo,");
            builder.AppendLine("    tarifa.Segmento,");
            builder.AppendLine("    tarifa.DataUltimoReajuste,");
            builder.AppendLine("    tarifa.Ativo");
            builder.AppendLine("FROM TarifasAplicacao tarifa");
            builder.AppendLine("INNER JOIN Concessionarias concessionaria ON concessionaria.Id = tarifa.ConcessionariaId");
            builder.AppendLine("WHERE tarifa.DataExclusao IS NULL");
            builder.AppendLine("ORDER BY concessionaria.Nome ASC, tarifa.segmento ASC, tarifa.DataUltimoReajuste DESC");

            var query = builder.ToString();

            return query;
        }

        public static string SalariosMinimo() {
            var builder = new StringBuilder();
            builder.AppendLine("SELECT");
            builder.AppendLine("    salario.Id,");
            builder.AppendLine("    salario.VigenciaInicial,");
            builder.AppendLine("    salario.VigenciaFinal,");
            builder.AppendLine("    salario.Valor,");
            builder.AppendLine("    salario.Ativo");
            builder.AppendLine("FROM SalariosMinimos salario");
            builder.AppendLine("WHERE salario.DataExclusao IS NULL");
            builder.AppendLine("ORDER BY salario.VigenciaInicial DESC");
            var query = builder.ToString();

            return query;
        }

        public static string EnergiasAcumuladas() {
            var builder = new StringBuilder();

            builder.AppendLine("SELECT");
            builder.AppendLine("    ea.Id,");
            builder.AppendLine("    ea.MesReferencia,");
            builder.AppendLine("    ea.ValorMensalAcumulado,");
            builder.AppendLine("    ea.ValorTotalAcumulado,");
            builder.AppendLine("    ea.PontoMedicaoId,");
            builder.AppendLine("    ea.Ativo,");
            builder.AppendLine("    pm.Nome AS PontoMedicaoDesc");
            builder.AppendLine("FROM EnergiasAcumuladas ea");
            builder.AppendLine("INNER JOIN (");
            builder.AppendLine("    SELECT PontoMedicaoId, MAX(MesReferencia) AS UltimaReferencia");
            builder.AppendLine("    FROM EnergiasAcumuladas");
            builder.AppendLine("    WHERE DataExclusao IS NULL");
            builder.AppendLine("    GROUP BY PontoMedicaoId");
            builder.AppendLine(") ult ON ea.PontoMedicaoId = ult.PontoMedicaoId AND ea.MesReferencia = ult.UltimaReferencia");
            builder.AppendLine("INNER JOIN PontosMedicao pm ON pm.Id = ea.PontoMedicaoId");
            builder.AppendLine("WHERE ea.DataExclusao IS NULL AND pm.DataExclusao IS NULL");
            builder.AppendLine("ORDER BY pm.Nome;");
            var query = builder.ToString();

            return query;
        }
    }
}
