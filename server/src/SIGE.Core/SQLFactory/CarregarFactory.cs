using System.Text;

namespace SIGE.Core.SQLFactory {
    public static class CarregarFactory {
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

        public static string SalarioMinimo() {
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
    }
}
