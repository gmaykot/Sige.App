using System.Text;
using SIGE.Core.Models.Requests;

namespace SIGE.Core.SQLFactory {
    public static class RelatorioMedicaoFactory {
        public static string ListaRelatoriosMedicao(RelatorioMedicaoRequest relatorio) {
            StringBuilder builder = new();

            builder.AppendLine("SELECT");
            builder.AppendLine("    forn.Id AS 'FornecedorId',");
            builder.AppendLine("    relatorio.Id AS 'Id',");
            builder.AppendLine("    contrato.Id AS 'ContratoId',");
            builder.AppendLine("    contrato.DscGrupo AS 'DescGrupo',");
            builder.AppendLine("    forn.Nome AS 'DescFornecedor',");
            builder.AppendLine("    IFNULL(relatorio.Fase, 0) AS 'Fase',");
            builder.AppendLine("    relatorio.MesReferencia AS 'MesReferencia',");
            builder.AppendLine("    relatorio.DataEmissao AS 'DataEmissao'");
            builder.AppendLine("FROM Contratos contrato");
            builder.AppendLine("INNER JOIN ContratoEmpresas contratoEmpresa ON contratoEmpresa.ContratoId = contrato.Id");
            builder.AppendLine("INNER JOIN Empresas emp ON emp.Id = contratoEmpresa.EmpresaId");
            builder.AppendLine("INNER JOIN Fornecedores forn ON forn.Id = contrato.FornecedorId");
            builder.AppendLine("LEFT JOIN RelatoriosMedicao relatorio ON relatorio.ContratoId = contrato.Id");
            builder.AppendLine("WHERE contrato.DataExclusao IS NULL");
            builder.AppendLine("ORDER BY emp.NomeFantasia, MesReferencia DESC");

            string query = builder.ToString();

            return query;
        }

        public static string ValoresRelatoriosMedicao(Guid contratoId, DateTime mesReferencia, Guid? empresaId) {
            StringBuilder builder = new();

            builder.AppendLine("SELECT");
            builder.AppendLine("    total.TipoEnergia AS 'TipoEnergia',");
            builder.AppendLine("    CONCAT(empresa.Logradouro, ', ', empresa.Bairro, ', ', empresa.Cidade, '/', empresa.Estado) AS 'DescEndereco',");
            builder.AppendLine("    empresa.Cnpj AS 'NumCnpj',");
            builder.AppendLine("    empresa.NomeFantasia AS 'DescEmpresa',");
            builder.AppendLine("    empresa.Id AS 'EmpresaId',");
            builder.AppendLine("    IFNULL(total.Icms, 17) AS 'Icms',");
            builder.AppendLine("    IFNULL(total.Proinfa, 0) AS 'Proinfa',");
            builder.AppendLine("    fornecedor.Id AS 'FornecedorId',");
            builder.AppendLine("    contrato.DataBase AS 'DataBase',");
            builder.AppendLine("    IFNULL(contrato.TakeMinimo,0) AS 'TakeMinimo',");
            builder.AppendLine("    IFNULL(contrato.TakeMaximo,0) AS 'TakeMaximo',");
            builder.AppendLine("    IFNULL(relatorio.Fase, 0) AS 'Fase',");
            builder.AppendLine("    contrato.Id AS 'ContratoId',");
            builder.AppendLine("    contrato.DscGrupo AS 'DescGrupo',");
            builder.AppendLine("    fornecedor.Nome AS 'DescFornecedor',");
            builder.AppendLine("    relatorio.Id AS 'Id',");
            builder.AppendLine("    relatorio.MesReferencia AS 'MesReferencia',");
            builder.AppendLine("    contrato.Numero AS 'NumContrato',");
            builder.AppendLine("    IFNULL(relatorio.ValorVendaCurtoPrazo, 0) AS 'ValorVendaCurtoPrazo',");
            builder.AppendLine("    IFNULL(relatorio.ValorCompraCurtoPrazo, 0) AS 'ValorCompraCurtoPrazo',");
            builder.AppendLine("    IFNULL(valorAnual.ValorUnitarioKwh, 0) AS 'ValorUnitarioKwh',");
            builder.AppendLine("    IFNULL(valorMensal.EnergiaContratada,0) AS 'EnergiaContratada',");
            builder.AppendLine("    IFNULL(valorMensal.HorasMes,0) AS 'HorasMes',");
            builder.AppendLine("    IFNULL(total.ConsumoAtivo, 0) AS 'TotalMedido',");
            builder.AppendLine("    relatorio.DataEmissao AS 'DataEmissao',");
            builder.AppendLine("    relatorio.Observacao,");
            builder.AppendLine("    relatorio.ObservacaoValidacao,");
            builder.AppendLine("    relatorio.Validado,");
            builder.AppendLine("    contrato.DataVigenciaInicial,");
            builder.AppendLine("    contrato.DataVigenciaFinal");
            builder.AppendLine("FROM Contratos contrato");
            builder.AppendLine("INNER JOIN ContratoEmpresas contratoEmpresa ON contratoEmpresa.ContratoId = contrato.Id");
            builder.AppendLine("INNER JOIN Empresas empresa ON empresa.Id = contratoEmpresa.EmpresaId");
            builder.AppendLine("INNER JOIN Fornecedores fornecedor ON fornecedor.Id = contrato.FornecedorId");
            builder.AppendLine("INNER JOIN ValoresAnuaisContrato valorAnual ON valorAnual.ContratoId = contrato.Id");
            builder.AppendLine("    AND DATE_FORMAT(valorAnual.DataVigenciaInicial, '%Y-%m-01') <= @MesReferencia");
            builder.AppendLine("    AND DATE_FORMAT(valorAnual.DataVigenciaFinal, '%Y-%m-01') >= @MesReferencia");
            builder.AppendLine("INNER JOIN ValoresMensaisContrato valorMensal ON valorMensal.ValorAnualContratoId = valorAnual.Id");
            builder.AppendLine("    AND DATE_FORMAT(valorMensal.MesReferencia, '%Y-%m-01') = @MesReferencia");
            builder.AppendLine("INNER JOIN (");
            builder.AppendLine("    SELECT");
            builder.AppendLine("        contratoEmpresa.ContratoId AS 'ContratoId',");
            builder.AppendLine("        DATE_FORMAT(medicao.Periodo, '%Y-%m-01') AS 'MesReferencia',");
            builder.AppendLine("        ponto.TipoEnergia AS 'TipoEnergia',");
            builder.AppendLine("        SUM(medicao.ConsumoAtivo) AS 'ConsumoAtivo',");
            builder.AppendLine("        SUM(DISTINCT valor.Proinfa) AS 'Proinfa',");
            builder.AppendLine("        SUM(DISTINCT valor.Icms) AS 'Icms'");
            builder.AppendLine("    FROM Medicoes medicao");
            builder.AppendLine("    INNER JOIN ConsumosMensais consumo ON consumo.Id = medicao.ConsumoMensalId");
            builder.AppendLine("    INNER JOIN PontosMedicao ponto ON ponto.Id = consumo.PontoMedicaoId");
            builder.AppendLine("    INNER JOIN AgentesMedicao agente ON agente.Id = ponto.AgenteMedicaoId");
            builder.AppendLine("    INNER JOIN Empresas empresa ON empresa.Id = agente.EmpresaId");
            builder.AppendLine("    INNER JOIN ContratoEmpresas contratoEmpresa ON contratoEmpresa.EmpresaId = empresa.Id");
            builder.AppendLine("    LEFT JOIN ValoresMensaisPontoMedicao valor ON valor.PontoMedicaoId = ponto.Id AND valor.MesReferencia = @MesReferencia AND valor.Ativo IS true");
            builder.AppendLine("    WHERE medicao.SubTipo LIKE 'L'");
            builder.AppendLine("      AND DATE_FORMAT(medicao.Periodo, '%Y-%m-01') = @MesReferencia");
            if (empresaId != null)
                builder.AppendLine("      AND empresa.Id = @EmpresaId");
            builder.AppendLine("    GROUP BY contratoEmpresa.ContratoId, DATE_FORMAT(medicao.Periodo, '%Y-%m-01'), ponto.TipoEnergia, consumo.ICMS, valor.Icms");
            builder.AppendLine(") AS total ON total.ContratoId = contrato.Id AND DATE_FORMAT(total.MesReferencia, '%Y-%m-01') = @MesReferencia");
            builder.AppendLine("LEFT JOIN (");
            builder.AppendLine("    SELECT * FROM RelatoriosMedicao");
            builder.AppendLine("    WHERE DATE_FORMAT(MesReferencia, '%Y-%m-01') = @MesReferencia");
            builder.AppendLine(") relatorio ON relatorio.ContratoId = contrato.Id");
            builder.AppendLine("WHERE empresa.Ativo = true AND contrato.Ativo = true AND contrato.Status = 0 AND contrato.DataExclusao IS null");
            builder.AppendLine("  AND contrato.Id = @ContratoId");
            if (empresaId != null)
                builder.AppendLine("  AND empresa.Id = @EmpresaId");
            builder.AppendLine("ORDER BY empresa.NomeFantasia");

            string query = builder.ToString()
                          .Replace("@MesReferencia", $"'{mesReferencia:yyyy-MM-dd}'")
                          .Replace("@ContratoId", $"'{contratoId}'")
                          .Replace("@EmpresaId", empresaId.HasValue ? $"'{empresaId.Value}'" : "NULL");

            return query;
        }
    }
}
