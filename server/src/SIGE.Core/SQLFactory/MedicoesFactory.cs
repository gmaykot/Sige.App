using SIGE.Core.Models.Dto.Geral.Medicao;
using System.Text;

namespace SIGE.Core.SQLFactory
{
    public static class MedicoesFactory
    {
        public static string ListaMedicoes(MedicaoDto req)
        {
            StringBuilder builder = new StringBuilder();
            builder.Append("SELECT consumo.Icms, consumo.Proinfa, consumo.Id AS 'Id', ponto.Id AS 'PontoMedicaoId', empresa.Id AS 'EmpresaId', empresa.NomeFantasia AS 'DescEmpresa', agente.Nome as 'DescAgente', agente.CodigoPerfilAgente as 'CodAgente', ponto.Nome AS 'DescPontoMedicao', ponto.Codigo AS 'PontoMedicao', consumo.StatusMedicao, consumo.DataMedicao, consumo.MesReferencia as 'Periodo', contrato.DataVigenciaInicial as 'DataVigenciaInicial', contrato.DataVigenciaFinal as 'DataVigenciaFinal' ");
            builder.Append("FROM Contratos contrato ");
            builder.Append("INNER JOIN ContratoEmpresas contratoEmpresa ON contratoEmpresa.ContratoId = contrato.Id ");
            builder.Append("INNER JOIN Empresas empresa ON empresa.Id = contratoEmpresa.EmpresaId ");
            builder.Append("INNER JOIN AgentesMedicao agente ON agente.EmpresaId = empresa.Id ");
            builder.Append("INNER JOIN PontosMedicao ponto ON ponto.AgenteMedicaoId = agente.Id ");
            builder.Append("LEFT OUTER JOIN ConsumosMensais consumo ON consumo.PontoMedicaoId = ponto.Id ");
            builder.Append("WHERE empresa.Ativo = true AND contrato.Ativo = true AND contrato.Status = 0 ");
            if (req.EmpresaId != null)
                builder.Append(string.Format("AND empresa.Id = '{0}' ", req.EmpresaId));
            if (req.DataMedicao != null)
                builder.Append(string.Format("AND consumo.DataMedicao = '{0}' ", req.DataMedicao?.ToString("yyyy-MM-dd")));
            if (req.Periodo != null)
                builder.Append(string.Format("AND DATE_FORMAT(consumo.MesReferencia, '%Y-%m-01') = '{0}' ", req.Periodo?.ToString("yyyy-MM-01")));
            if (req.StatusMedicao != null)
                builder.Append(string.Format("AND consumo.StatusMedicao = {0} ", (int)req.StatusMedicao));
            builder.Append("ORDER BY empresa.NomeFantasia, agente.CodigoPerfilAgente, ponto.Codigo, consumo.MesReferencia DESC ");

            return builder.ToString();
        }

        public static string ListaMedicoesPorContrato(Guid contratoId, DateTime periodoMedicao)
        {
            StringBuilder builder = new StringBuilder();
            builder.Append("SELECT empresa.NomeFantasia 'DescEmpresa', medicao.Periodo 'DiaMedicaoo', agente.Nome 'DescAgenteMedicao', ponto.Codigo 'DescPontoMedicao', medicao.SubTipo, medicao.Status, medicao.ConsumoAtivo 'TotalConsumoAtivo' ");
            builder.Append("FROM Contratos contrato ");
            builder.Append("INNER JOIN ContratoEmpresas contratoEmpresa ON contratoEmpresa.ContratoId = contrato.Id ");
            builder.Append("INNER JOIN Empresas empresa ON empresa.Id = contratoEmpresa.EmpresaId ");
            builder.Append("INNER JOIN AgentesMedicao agente ON agente.EmpresaId = empresa.Id ");
            builder.Append("INNER JOIN PontosMedicao ponto ON ponto.AgenteMedicaoId = agente.Id ");
            builder.Append("INNER JOIN ConsumosMensais consumo ON consumo.PontoMedicaoId = ponto.Id ");
            builder.Append("INNER JOIN Medicoes medicao ON medicao.ConsumoMensalId = consumo.Id ");
            builder.Append("WHERE empresa.Ativo = true AND contrato.Ativo = true AND contrato.Status = 0 and medicao.SubTipo = 'L' ");
            builder.Append(string.Format("AND contrato.Id = '{0}' ", contratoId));
            builder.Append(string.Format("AND DATE_FORMAT(consumo.MesReferencia, '%Y-%m-01') = '{0}' ", periodoMedicao.ToString("yyyy-MM-01")));
            builder.Append("GROUP BY medicao.Id ");
            builder.Append("ORDER BY empresa.NomeFantasia, medicao.Periodo ");

            return builder.ToString();
        }
    }
}
