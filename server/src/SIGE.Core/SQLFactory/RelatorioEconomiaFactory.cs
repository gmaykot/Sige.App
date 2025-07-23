using System.Text;

namespace SIGE.Core.SQLFactory {
    public static class RelatorioEconomiaFactory {
        public static string ListaRelatorios(DateOnly mesReferencia) {
            StringBuilder builder = new StringBuilder();

            builder.AppendLine("SELECT");
            builder.AppendLine("    null AS 'Id',");
            builder.AppendLine("    ponto.Id AS 'PontoMedicaoId',");
            builder.AppendLine("    contrato.Id AS 'ContratoId',");
            builder.AppendLine("    ponto.Nome AS 'DescPontoMedicao',");
            builder.AppendLine("    concessionaria.Nome AS 'DescConcessionaria',");
            builder.AppendLine("    fatura.MesReferencia,");
            builder.AppendLine("    fatura.DataVencimento,");
            builder.AppendLine("    false AS 'Validado'");
            builder.AppendLine("FROM Contratos contrato");
            builder.AppendLine("INNER JOIN ContratoEmpresas contratoEmpresa ON contratoEmpresa.ContratoId = contrato.Id");
            builder.AppendLine("INNER JOIN Empresas empresa ON empresa.Id = contratoEmpresa.EmpresaId");
            builder.AppendLine("INNER JOIN AgentesMedicao agente ON agente.EmpresaId = empresa.Id");
            builder.AppendLine("INNER JOIN PontosMedicao ponto ON ponto.AgenteMedicaoId = agente.Id");
            builder.AppendLine("INNER JOIN Concessionarias concessionaria ON concessionaria.Id = ponto.ConcessionariaId");
            builder.AppendLine("INNER JOIN FaturasEnergia fatura ON fatura.PontoMedicaoId = ponto.Id");
            builder.AppendLine("INNER JOIN ConsumosMensais consumo ON consumo.PontoMedicaoId = ponto.Id");
            builder.AppendLine("WHERE contrato.Ativo = true");
            builder.AppendLine("    AND contrato.DataExclusao IS NULL");
            builder.AppendLine("    AND DATE_FORMAT(fatura.MesReferencia, '%Y-%m-01') = '@MesReferencia'");
            builder.AppendLine("    AND consumo.MesReferencia = fatura.MesReferencia");
            builder.AppendLine("ORDER BY ponto.Nome, fatura.MesReferencia DESC;");

            string query = builder.ToString()
                .Replace("@MesReferencia", mesReferencia.ToString("yyyy-MM-01"));

            return query;

        }

        public static string RelatorioFinal(Guid PontoMedicaoId, DateOnly mesReferencia) {
            StringBuilder builder = new StringBuilder();

            builder.AppendLine("SELECT");
            builder.AppendLine("    contratoEmpresa.ContratoId AS 'ContratoId',");
            builder.AppendLine("    null AS 'Id',");
            builder.AppendLine("    ponto.Nome AS 'Unidade',");
            builder.AppendLine("    ponto.Segmento AS 'Segmento',");
            builder.AppendLine("    'Sul' AS 'SubMercado',");
            builder.AppendLine("    ponto.conexao AS 'Conexao',");
            builder.AppendLine("    concessionaria.Nome AS 'Concessao',");
            builder.AppendLine("    null 'Bandeira',");
            builder.AppendLine("    empresa.CNPJ AS 'CNPJ',");
            builder.AppendLine("    empresa.InscricaoEstadual AS 'InscricaoEstadual',");
            builder.AppendLine("    empresa.Logradouro AS 'Endereco',");
            builder.AppendLine("    empresa.Cidade AS 'Municipio',");
            builder.AppendLine("    empresa.Estado AS 'UF'");
            builder.AppendLine("FROM Contratos contrato");
            builder.AppendLine("INNER JOIN ContratoEmpresas contratoEmpresa ON contratoEmpresa.ContratoId = contrato.Id");
            builder.AppendLine("INNER JOIN Empresas empresa ON empresa.Id = contratoEmpresa.EmpresaId");
            builder.AppendLine("INNER JOIN AgentesMedicao agente ON agente.EmpresaId = empresa.Id");
            builder.AppendLine("INNER JOIN PontosMedicao ponto ON ponto.AgenteMedicaoId = agente.Id");
            builder.AppendLine("INNER JOIN Concessionarias concessionaria ON concessionaria.Id = ponto.ConcessionariaId");
            builder.AppendLine("WHERE contrato.Ativo = true");
            builder.AppendLine("    AND ponto.Id = '@PontoMedicaoId'");
            builder.AppendLine("    AND contrato.DataExclusao IS NULL");

            string query = builder.ToString()
                .Replace("@PontoMedicaoId", PontoMedicaoId.ToString());

            return query;
        }

        public static string ObterParametrosRelatorioEconomia() {

            StringBuilder builder = new();

            builder.AppendLine("SELECT");
            builder.AppendLine("    f.Id AS FaturamentoId,");
            builder.AppendLine("    f.VigenciaInicial,");
            builder.AppendLine("    f.VigenciaFinal,");
            builder.AppendLine("    f.ValorFixo,");
            builder.AppendLine("    f.Porcentagem,");
            builder.AppendLine("    f.QtdeSalarios,");
            builder.AppendLine("    ponto.IncideICMS,");
            builder.AppendLine("    imp.Id AS ImpostoId,");
            builder.AppendLine("    imp.ValorPis,");
            builder.AppendLine("    imp.ValorCofins,");
            builder.AppendLine("    sm.Id AS SalarioMinimoId,");
            builder.AppendLine("    sm.Valor AS SalarioMinimoValor,");
            builder.AppendLine("    ea.Id AS EnergiaAcumuladaId,");
            builder.AppendLine("    ea.ValorMensalAcumulado,");
            builder.AppendLine("    ea.ValorTotalAcumulado,");
            builder.AppendLine("    btv.Id AS BandeiraVigenteId,");
            builder.AppendLine("    btv.Bandeira,");
            builder.AppendLine("    CASE btv.Bandeira");
            builder.AppendLine("        WHEN 0 THEN bt.ValorBandeiraAmarela");
            builder.AppendLine("        WHEN 1 THEN bt.ValorBandeiraVerde");
            builder.AppendLine("        WHEN 2 THEN bt.ValorBandeiraVermelha1");
            builder.AppendLine("        WHEN 3 THEN bt.ValorBandeiraVermelha2");
            builder.AppendLine("    END AS ValorBandeiraAplicado,");
            builder.AppendLine("    cm.Id AS ConsumoId,");
            builder.AppendLine("    cm.Proinfa,");
            builder.AppendLine("    cm.Icms");
            builder.AppendLine("FROM FaturamentosCoenel f");
            builder.AppendLine("LEFT JOIN ImpostosConcessionarias imp");
            builder.AppendLine("    ON imp.ConcessionariaId = @ConcessionariaId");
            builder.AppendLine("    AND DATE_FORMAT(imp.MesReferencia, '%Y-%m-01') = DATE_FORMAT(@MesReferencia, '%Y-%m-01')");
            builder.AppendLine("    AND imp.Ativo = TRUE");
            builder.AppendLine("    AND imp.DataExclusao IS NULL");
            builder.AppendLine("LEFT JOIN (");
            builder.AppendLine("    SELECT *");
            builder.AppendLine("    FROM SalariosMinimos");
            builder.AppendLine("    WHERE VigenciaInicial <= @MesReferencia");
            builder.AppendLine("      AND (VigenciaFinal IS NULL OR VigenciaFinal >= @MesReferencia)");
            builder.AppendLine("      AND Ativo = TRUE");
            builder.AppendLine("      AND DataExclusao IS NULL");
            builder.AppendLine("    ORDER BY VigenciaInicial DESC");
            builder.AppendLine("    LIMIT 1");
            builder.AppendLine(") sm ON 1=1");
            builder.AppendLine("LEFT JOIN EnergiasAcumuladas ea");
            builder.AppendLine("    ON ea.PontoMedicaoId = @PontoMedicaoId");
            builder.AppendLine("    AND DATE_FORMAT(ea.MesReferencia, '%Y-%m-01') = DATE_FORMAT(@MesReferencia, '%Y-%m-01')");
            builder.AppendLine("    AND ea.Ativo = TRUE");
            builder.AppendLine("    AND ea.DataExclusao IS NULL");
            builder.AppendLine("LEFT JOIN BandeiraTarifariaVigente btv");
            builder.AppendLine("    ON DATE_FORMAT(btv.MesReferencia, '%Y-%m-01') = DATE_FORMAT(@MesReferencia, '%Y-%m-01')");
            builder.AppendLine("    AND btv.Ativo = TRUE");
            builder.AppendLine("    AND btv.DataExclusao IS NULL");
            builder.AppendLine("LEFT JOIN BandeirasTarifarias bt");
            builder.AppendLine("    ON bt.Id = btv.BandeiraTarifariaId");
            builder.AppendLine("    AND DATE_FORMAT(@MesReferencia, '%Y-%m-01') BETWEEN DATE_FORMAT(bt.VigenciaInicial, '%Y-%m-01')");
            builder.AppendLine("                                                AND IFNULL(DATE_FORMAT(bt.VigenciaFinal, '%Y-%m-01'), DATE_FORMAT(@MesReferencia, '%Y-%m-01'))");
            builder.AppendLine("    AND bt.Ativo = TRUE");
            builder.AppendLine("    AND bt.DataExclusao IS NULL");
            builder.AppendLine("LEFT JOIN ConsumosMensais cm");
            builder.AppendLine("    ON cm.PontoMedicaoId = @PontoMedicaoId");
            builder.AppendLine("    AND DATE_FORMAT(cm.MesReferencia, '%Y-%m-01') = DATE_FORMAT(@MesReferencia, '%Y-%m-01')");
            builder.AppendLine("    AND cm.Ativo = TRUE");
            builder.AppendLine("    AND cm.DataExclusao IS NULL");
            builder.AppendLine("LEFT JOIN PontosMedicao ponto");
            builder.AppendLine("    ON ponto.Id = @PontoMedicaoId");
            builder.AppendLine("WHERE f.PontoMedicaoId = @PontoMedicaoId");
            builder.AppendLine("  AND f.VigenciaInicial <= @MesReferencia");
            builder.AppendLine("  AND (f.VigenciaFinal IS NULL OR f.VigenciaFinal >= @MesReferencia)");
            builder.AppendLine("  AND f.Ativo = TRUE");
            builder.AppendLine("  AND f.DataExclusao IS NULL");

            string query = builder.ToString();

            return query;
        }
    }
}
