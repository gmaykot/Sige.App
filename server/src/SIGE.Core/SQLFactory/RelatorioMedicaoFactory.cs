using SIGE.Core.Models.Requests;
using System.Text;

namespace SIGE.Core.SQLFactory
{
    public static class RelatorioMedicaoFactory
    {
        public static string ListaRelatoriosMedicao(RelatorioMedicaoRequest relatorio)
        {
            StringBuilder builder = new StringBuilder();
            builder.Append("SELECT forn.Id AS 'FornecedorId', relatorio.Id AS 'Id', contrato.Id AS 'ContratoId', contrato.DscGrupo AS 'DescGrupo', forn.Nome AS 'DescFornecedor', IFNULL(relatorio.Fase, 0) AS 'Fase', relatorio.MesReferencia AS 'MesReferencia', relatorio.DataEmissao AS 'DataEmissao'");
            builder.Append("FROM Contratos contrato ");
            builder.Append("INNER JOIN ContratoEmpresas contratoEmpresa ON contratoEmpresa.ContratoId = contrato.Id ");
            builder.Append("INNER JOIN Empresas emp on emp.Id = contratoEmpresa.EmpresaId ");
            builder.Append("INNER JOIN Fornecedores forn on forn.Id = contrato.FornecedorId ");
            builder.Append("LEFT JOIN RelatoriosMedicao relatorio on relatorio.ContratoId = contrato.Id ");
            builder.Append("ORDER BY emp.NomeFantasia");
            return builder.ToString();
        }

        public static string ValoresRelatoriosMedicao(Guid contratoId, DateTime mesReferencia, Guid? empresaId)
        {
            StringBuilder builder = new StringBuilder();
            builder.Append("SELECT contrato.TipoEnergia as 'TipoEnergia', CONCAT(empresa.Logradouro, ', ', empresa.Bairro, ', ', empresa.Cidade, '/', empresa.Estado) AS 'DescEndereco', empresa.Cnpj AS 'NumCnpj', empresa.NomeFantasia AS 'DescEmpresa', empresa.Id AS 'EmpresaId', total.Icms, total.Proinfa, fornecedor.Id AS 'FornecedorId', contrato.DataBase AS 'DataBase', IFNULL(contrato.TakeMinimo,0) AS 'TakeMinimo', IFNULL(contrato.TakeMaximo,0) AS 'TakeMaximo', IFNULL(relatorio.Fase, 0) AS 'Fase', contrato.Id as 'ContratoId', contrato.DscGrupo AS 'DescGrupo', fornecedor.Nome AS 'DescFornecedor', relatorio.Id AS 'Id', relatorio.MesReferencia AS 'MesReferencia', contrato.Numero AS 'NumContrato', IFNULL(valorAnual.ValorUnitarioKwh, 0) AS 'ValorUnitarioKwh', IFNULL(valorMensal.EnergiaContratada,0) AS 'EnergiaContratada', IFNULL(valorMensal.HorasMes,0) AS 'HorasMes', IFNULL(total.ConsumoAtivo, 0) AS 'TotalMedido', relatorio.DataEmissao AS 'DataEmissao', relatorio.Observacao, relatorio.ObservacaoValidacao, relatorio.Validado, contrato.DataVigenciaInicial, contrato.DataVigenciaFinal ");
            builder.Append("FROM Contratos contrato ");
            builder.Append("INNER JOIN ContratoEmpresas contratoEmpresa ON contratoEmpresa.ContratoId = contrato.Id ");
            builder.Append("INNER JOIN Empresas empresa ON empresa.Id = contratoEmpresa.EmpresaId ");
            builder.Append("INNER JOIN Fornecedores fornecedor ON fornecedor.Id = contrato.FornecedorId ");
            builder.Append("INNER JOIN ValoresAnuaisContrato valorAnual ON valorAnual.ContratoId = contrato.Id ");
            builder.Append(string.Format("AND DATE_FORMAT(valorAnual.DataVigenciaInicial, '%Y-%m-01') <= '{0}' AND DATE_FORMAT(valorAnual.DataVigenciaFinal, '%Y-%m-01') >= '{0}' ", mesReferencia.ToString("yyyy-MM-01")));
            builder.Append("INNER JOIN ValoresMensaisContrato valorMensal ON valorMensal.ValorAnualContratoId = valorAnual.Id ");
            builder.Append(string.Format("AND DATE_FORMAT(valorMensal.Competencia, '%Y-%m-01') = '{0}' ", mesReferencia.ToString("yyyy-MM-01")));
            builder.Append("INNER JOIN  ");
            builder.Append("	( ");
            builder.Append("	SELECT ");
            builder.Append("		contratoEmpresa.ContratoId AS 'ContratoId', ");
            builder.Append("		SUM(medicao.ConsumoAtivo) AS 'ConsumoAtivo', ");
            builder.Append("		SUM(DISTINCT consumo.proinfa) AS 'Proinfa', ");
            builder.Append("		consumo.ICMS AS 'Icms', ");
            builder.Append("        DATE_FORMAT(medicao.Periodo, '%Y-%m-01') AS 'MesReferencia' ");
            builder.Append("	FROM Medicoes medicao ");
            builder.Append("	INNER JOIN ConsumosMensais consumo ON consumo.Id = medicao.ConsumoMensalId ");
            builder.Append("	INNER JOIN PontosMedicao ponto ON ponto.Id = consumo.PontoMedicaoId ");
            builder.Append("	INNER JOIN AgentesMedicao agente ON agente.Id = ponto.AgenteMedicaoId ");
            builder.Append("	INNER JOIN Empresas empresa ON empresa.Id = agente.EmpresaId ");
            builder.Append("	INNER JOIN ContratoEmpresas contratoEmpresa ON contratoEmpresa.EmpresaId = empresa.Id ");
            builder.Append(string.Format("	WHERE medicao.SubTipo LIKE 'L' AND DATE_FORMAT(medicao.Periodo, '%Y-%m-01') = '{0}' ", mesReferencia.ToString("yyyy-MM-01")));
            if (empresaId != null)
                builder.Append(string.Format("AND empresa.Id = '{0}' ", empresaId));
            builder.Append("	GROUP BY contratoEmpresa.ContratoId ");
            builder.Append("    ) AS total ON total.ContratoId = contrato.Id ");
            builder.Append(string.Format("AND DATE_FORMAT(total.MesReferencia, '%Y-%m-01') = '{0}' ", mesReferencia.ToString("yyyy-MM-01")));
            builder.Append("LEFT JOIN RelatoriosMedicao relatorio ON relatorio.ContratoId = contrato.Id ");
            builder.Append("WHERE empresa.Ativo = true AND contrato.Ativo = true AND contrato.Status = 0 ");
            builder.Append(string.Format("AND contrato.Id = '{0}' ", contratoId));
            
            if (empresaId != null)
                builder.Append(string.Format("AND empresa.Id = '{0}' ", empresaId));
            
            builder.Append("ORDER BY empresa.NomeFantasia");

            return builder.ToString();
        }
    }
}
