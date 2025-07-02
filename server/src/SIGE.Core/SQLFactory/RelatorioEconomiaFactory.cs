using System.Text;

namespace SIGE.Core.SQLFactory
{
    public static class RelatorioEconomiaFactory
    {
        public static string ListaRelatorios(DateOnly mesReferencia)
        {
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

        public static string RelatorioFinal(Guid PontoMedicaoId, DateOnly mesReferencia)
        {
            StringBuilder builder = new StringBuilder();

            builder.AppendLine("SELECT");
            builder.AppendLine("    contratoEmpresa.ContratoId AS 'ContratoId',");
            builder.AppendLine("    null AS 'Id',");
            builder.AppendLine("    ponto.Nome AS 'Unidade',");
            builder.AppendLine("    ponto.Segmento AS 'Segmento',");
            builder.AppendLine("    'Sul' AS 'SubMercado',");
            builder.AppendLine("    ponto.conexao AS 'Conexao',");
            builder.AppendLine("    concessionaria.Nome AS 'Concessao',");
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
    }
}
