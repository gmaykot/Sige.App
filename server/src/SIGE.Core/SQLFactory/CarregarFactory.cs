using System.Text;

namespace SIGE.Core.SQLFactory {
    public static class CarregarFactory {
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
            builder.AppendLine("    tarifa.KWPonta,");
            builder.AppendLine("    tarifa.KWForaPonta,");
            builder.AppendLine("    tarifa.KWhPontaTUSD,");
            builder.AppendLine("    tarifa.KWhForaPontaTUSD,");
            builder.AppendLine("    tarifa.KWhPontaTE,");
            builder.AppendLine("    tarifa.KWhForaPontaTE,");
            builder.AppendLine("    tarifa.ReatKWhPFTE,");
            builder.AppendLine("    tarifa.Ativo");
            builder.AppendLine("FROM TarifasAplicacao tarifa");
            builder.AppendLine("INNER JOIN Concessionarias concessionaria ON concessionaria.Id = tarifa.ConcessionariaId");
            builder.AppendLine("WHERE tarifa.Id = @Id");

            var query = builder.ToString();


            return query;
        }

        public static string SalariosMinimos() {
            var builder = new StringBuilder();
            builder.AppendLine("SELECT");
            builder.AppendLine("    salario.Id,");
            builder.AppendLine("    salario.VigenciaInicial,");
            builder.AppendLine("    salario.VigenciaFinal,");
            builder.AppendLine("    salario.Valor,");
            builder.AppendLine("    salario.Ativo,");
            builder.AppendLine("    salario.DataExclusao,");
            builder.AppendLine("    salario.DataRegistro");
            builder.AppendLine("FROM SalariosMinimos salario");
            builder.AppendLine("WHERE salario.DataExclusao IS NULL AND salario.Id = @Id");
            builder.AppendLine("ORDER BY salario.VigenciaInicial DESC, salario.DataRegistro DESC");
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
            builder.AppendLine("WHERE ea.Id = @Id AND ea.DataExclusao IS NULL AND pm.DataExclusao IS NULL");
            builder.AppendLine("ORDER BY pm.Nome;");
            var query = builder.ToString();

            return query;
        }

        public static string Fornecedores() {
            var builder = new StringBuilder();

            builder.AppendLine("SELECT");
            builder.AppendLine("    forn.Id,");
            builder.AppendLine("    forn.Nome,");
            builder.AppendLine("    forn.CNPJ,");
            builder.AppendLine("    forn.TelefoneContato,");
            builder.AppendLine("    forn.TelefoneAlternativo,");
            builder.AppendLine("    forn.Ativo");
            builder.AppendLine("FROM Fornecedores forn");
            builder.AppendLine("WHERE forn.DataExclusao IS NULL AND forn.Id = @Id");
            builder.AppendLine("ORDER BY forn.Nome;");
            var query = builder.ToString();

            return query;
        }
    }
}
