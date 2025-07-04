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

        public static string TarifaAplicacao() {
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
            builder.AppendLine("ORDER BY concessionaria.Nome ASC, tarifa.segmento ASC, tarifa.DataUltimoReajuste DESC");

            var query = builder.ToString();

            return query;
        }
    }
}
