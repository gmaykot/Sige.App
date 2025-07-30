using System.Text;

namespace SIGE.Core.SQLFactory {
    public static class GerenciamentoMensalFactory {
        public static string ListaValoresMensaisPontosMedicao() {
            StringBuilder sql = new();

            sql.AppendLine("SELECT");
            sql.AppendLine("    valor.Id,");
            sql.AppendLine("    valor.Proinfa,");
            sql.AppendLine("    valor.Icms,");
            sql.AppendLine("    valor.MesReferencia,");
            sql.AppendLine("    valor.ValorDescontoRETUSD,");
            sql.AppendLine("    ponto.Nome AS 'DescPontoMedicao',");
            sql.AppendLine("    ponto.Id AS 'PontoMedicaoId',");
            sql.AppendLine("    empresa.NomeFantasia AS 'DescEmpresa'");
            sql.AppendLine("FROM");
            sql.AppendLine("    PontosMedicao ponto");
            sql.AppendLine("INNER JOIN AgentesMedicao agente ON agente.Id = ponto.AgenteMedicaoId");
            sql.AppendLine("INNER JOIN Empresas empresa ON empresa.Id = agente.EmpresaId");
            sql.AppendLine("LEFT JOIN ValoresMensaisPontoMedicao valor ON valor.PontoMedicaoId = ponto.Id AND valor.MesReferencia = @MesReferencia AND valor.Ativo IS true");
            sql.AppendLine("WHERE");
            sql.AppendLine("    ponto.Ativo IS true");
            sql.AppendLine("    AND (@EmpresaId IS NULL OR empresa.Id = @EmpresaId)");
            sql.AppendLine("    AND ponto.DataExclusao IS null");
            sql.AppendLine("ORDER BY");
            sql.AppendLine("    ponto.nome,");
            sql.AppendLine("    empresa.nome;");

            string query = sql.ToString();

            return query;
        }

        public static string ListaPisCofins() {
            StringBuilder sql = new();

            sql.AppendLine("SELECT");
            sql.AppendLine("    imposto.Id,");
            sql.AppendLine("    imposto.ValorPis AS 'Pis',");
            sql.AppendLine("    imposto.ValorCofins AS 'Cofins',");
            sql.AppendLine("    imposto.MesReferencia,");
            sql.AppendLine("    concessionaria.Id AS 'ConcessionariaId',");
            sql.AppendLine("    concessionaria.Nome AS 'DescConcessionaria'");
            sql.AppendLine("FROM");
            sql.AppendLine("    Concessionarias concessionaria");
            sql.AppendLine("LEFT JOIN ImpostosConcessionarias imposto ON imposto.ConcessionariaId = concessionaria.Id AND imposto.MesReferencia = {0} AND imposto.Ativo IS true");
            sql.AppendLine("WHERE");
            sql.AppendLine("    concessionaria.Ativo IS true");
            sql.AppendLine("    AND concessionaria.DataExclusao IS null");
            sql.AppendLine("ORDER BY");
            sql.AppendLine("    concessionaria.Nome;");

            string query = sql.ToString();

            return query;
        }

        public static string ObterBandeiraMesReferencia() {
            StringBuilder sql = new();

            sql.AppendLine("SELECT");
            sql.AppendLine("    bandeiraVigente.Id,");
            sql.AppendLine("    bandeiraVigente.MesReferencia,");
            sql.AppendLine("    bandeiraVigente.Bandeira,");
            sql.AppendLine("    bandeira.Id AS 'BandeiraTarifariaId'");
            sql.AppendLine("FROM");
            sql.AppendLine("    BandeirasTarifarias bandeira");
            sql.AppendLine("LEFT JOIN BandeiraTarifariaVigente bandeiraVigente ON bandeiraVigente.BandeiraTarifariaId = bandeira.Id AND bandeiraVigente.MesReferencia = @MesReferencia and bandeiraVigente.Ativo IS true");
            sql.AppendLine("WHERE");
            sql.AppendLine("    bandeira.VigenciaInicial <= @VigenciaInicialFiltro");
            sql.AppendLine("    AND (bandeira.VigenciaFinal IS NULL OR bandeira.VigenciaFinal >= @VigenciaFinalFiltro)");
            sql.AppendLine("    AND bandeira.Ativo IS true");
            sql.AppendLine("    AND bandeira.DataExclusao IS null;");

            string query = sql.ToString();

            return query;
        }

        public static string ListaDescontoTusd() {
            var sql = new StringBuilder();

            sql.AppendLine("SELECT");
            sql.AppendLine("  desconto.Id,");
            sql.AppendLine("  desconto.MesReferencia,");
            sql.AppendLine("  forn.Id AS FornecedorId,");
            sql.AppendLine("  forn.Nome AS DescFornecedor,");
            sql.AppendLine("  energia AS TipoEnergia,");
            sql.AppendLine("  desconto.ValorDescontoTUSD,");
            sql.AppendLine("  0.0 as ValorDescontoRETUSD");
            sql.AppendLine("FROM");
            sql.AppendLine("  Fornecedores forn");
            sql.AppendLine("LEFT JOIN (");
            sql.AppendLine("  select 0 as energia");
            sql.AppendLine("  union all select 1");
            sql.AppendLine("  union all select 2");
            sql.AppendLine("  union all select 3");
            sql.AppendLine(") energia on 1 = 1");
            sql.AppendLine("LEFT JOIN DescontosTusd desconto on desconto.FornecedorId = forn.Id AND desconto.TipoEnergia = energia AND desconto.MesReferencia = {0}");
            sql.AppendLine("ORDER BY  forn.Nome, energia;");

            string query = sql.ToString();

            return query;
        }

        public static string ObterDescontoTusd() {
            var sb = new StringBuilder();
            sb.AppendLine("SELECT ");
            sb.AppendLine("  desconto.Id,");
            sb.AppendLine("  desconto.MesReferencia,");
            sb.AppendLine("  forn.Id AS FornecedorId,");
            sb.AppendLine("  forn.Nome AS DescFornecedor,");
            sb.AppendLine("  COALESCE(desconto.ValorDescontoTUSD, 0) AS ValorDescontoTUSD,");
            sb.AppendLine("  COALESCE(valores.ValorDescontoRETUSD, 0) AS ValorDescontoRETUSD,");
            sb.AppendLine("  COALESCE(desconto.TipoEnergia, 99) AS TipoEnergia");
            sb.AppendLine("FROM PontosMedicao ponto");
            sb.AppendLine("INNER JOIN AgentesMedicao agente ON agente.id = ponto.AgenteMedicaoId");
            sb.AppendLine("INNER JOIN Empresas emp ON emp.id = agente.EmpresaId");
            sb.AppendLine("INNER JOIN ContratoEmpresas contEmp ON contEmp.EmpresaId = emp.id");
            sb.AppendLine("INNER JOIN Contratos cont ON cont.id = contEmp.ContratoId");
            sb.AppendLine("INNER JOIN Fornecedores forn ON forn.id = cont.FornecedorId");
            sb.AppendLine("LEFT JOIN DescontosTusd desconto ");
            sb.AppendLine("       ON desconto.FornecedorId = forn.id ");
            sb.AppendLine("      AND ponto.TipoEnergia = desconto.TipoEnergia");
            sb.AppendLine("      AND desconto.MesReferencia = @MesReferencia");
            sb.AppendLine("LEFT JOIN ValoresMensaisPontoMedicao valores ");
            sb.AppendLine("       ON valores.PontoMedicaoId = ponto.id");
            sb.AppendLine("      AND valores.MesReferencia = @MesReferencia");
            sb.AppendLine("WHERE ponto.Id = @PontoMedicaoId");
            sb.AppendLine("GROUP BY ponto.Id");

            string query = sb.ToString();
            return query;
        }
    }
}
