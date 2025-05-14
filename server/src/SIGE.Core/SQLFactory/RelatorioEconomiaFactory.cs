using System.Text;

namespace SIGE.Core.SQLFactory
{
    public static class RelatorioEconomiaFactory
    {
        public static string ListaRelatorios(DateOnly mesReferencia)
        {
            StringBuilder builder = new StringBuilder();
            builder.Append("SELECT null AS 'Id', ponto.Id AS 'PontoMedicaoId' , contrato.Id AS 'ContratoId', ponto.Nome AS 'DescPontoMedicao', concessionaria.Nome AS 'DescConcessionaria', fatura.MesReferencia, fatura.DataVencimento, false as 'Validado' ");
            builder.Append("FROM Contratos contrato ");
            builder.Append("INNER JOIN ContratoEmpresas contratoEmpresa ON contratoEmpresa.ContratoId = contrato.Id ");
            builder.Append("INNER JOIN Empresas empresa ON empresa.Id = contratoEmpresa.EmpresaId ");
            builder.Append("INNER JOIN AgentesMedicao agente ON agente.EmpresaId = empresa.Id ");
            builder.Append("INNER JOIN PontosMedicao ponto ON ponto.AgenteMedicaoId = agente.Id ");
            builder.Append("INNER JOIN Concessionarias concessionaria ON concessionaria.Id = contrato.ConcessionariaId ");
            builder.Append("INNER JOIN FaturasEnergia fatura ON fatura.PontoMedicaoId = ponto.Id ");
            builder.Append("INNER JOIN ConsumosMensais consumo ON consumo.PontoMedicaoId = ponto.Id ");
            builder.Append("WHERE contrato.Ativo = true ");
            builder.Append("AND consumo.MesReferencia = fatura.MesReferencia ");
            builder.Append("ORDER BY ponto.Nome, fatura.MesReferencia DESC;");

            return builder.ToString();
        }

        public static string RelatorioFinal(Guid PontoMedicaoId, DateOnly mesReferencia)
        {
            StringBuilder builder = new StringBuilder();
            builder.Append("SELECT null AS 'Id', ponto.Nome AS 'Unidade', ponto.Segmento AS 'Segmento','Sul' AS 'SubMercado', '-' AS 'Conexao', concessionaria.Nome AS 'Concessao', empresa.CNPJ AS 'CNPJ', empresa.InscricaoEstadual AS 'InscricaoEstadual', empresa.Logradouro AS 'Endereco', empresa.Bairro AS 'Municipio', empresa.Estado AS 'UF' ");
            builder.Append("FROM Contratos contrato ");
            builder.Append("INNER JOIN ContratoEmpresas contratoEmpresa ON contratoEmpresa.ContratoId = contrato.Id ");
            builder.Append("INNER JOIN Empresas empresa ON empresa.Id = contratoEmpresa.EmpresaId ");
            builder.Append("INNER JOIN AgentesMedicao agente ON agente.EmpresaId = empresa.Id ");
            builder.Append("INNER JOIN PontosMedicao ponto ON ponto.AgenteMedicaoId = agente.Id ");
            builder.Append("INNER JOIN Concessionarias concessionaria ON concessionaria.Id = contrato.ConcessionariaId ");
            builder.Append($"WHERE contrato.Ativo = true AND ponto.Id = '{PontoMedicaoId}'");

            return builder.ToString();
        }
    }
}
