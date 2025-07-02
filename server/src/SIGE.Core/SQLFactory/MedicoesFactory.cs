using SIGE.Core.Models.Dto.Geral.Medicao;
using System.Text;

namespace SIGE.Core.SQLFactory
{
    public static class MedicoesFactory
    {
        public static string ListaMedicoes(MedicaoDto req)
        {
            StringBuilder builder = new();

            builder.AppendLine("SELECT");
            builder.AppendLine("    consumo.Icms,");
            builder.AppendLine("    consumo.Proinfa,");
            builder.AppendLine("    consumo.Id AS 'Id',");
            builder.AppendLine("    ponto.Id AS 'PontoMedicaoId',");
            builder.AppendLine("    empresa.Id AS 'EmpresaId',");
            builder.AppendLine("    empresa.NomeFantasia AS 'DescEmpresa',");
            builder.AppendLine("    agente.Nome AS 'DescAgente',");
            builder.AppendLine("    agente.CodigoPerfilAgente AS 'CodAgente',");
            builder.AppendLine("    ponto.Nome AS 'DescPontoMedicao',");
            builder.AppendLine("    ponto.Codigo AS 'PontoMedicao',");
            builder.AppendLine("    consumo.StatusMedicao,");
            builder.AppendLine("    consumo.DataMedicao,");
            builder.AppendLine("    consumo.MesReferencia AS 'Periodo',");
            builder.AppendLine("    contrato.DataVigenciaInicial AS 'DataVigenciaInicial',");
            builder.AppendLine("    contrato.DataVigenciaFinal AS 'DataVigenciaFinal'");
            builder.AppendLine("FROM Contratos contrato");
            builder.AppendLine("INNER JOIN ContratoEmpresas contratoEmpresa ON contratoEmpresa.ContratoId = contrato.Id");
            builder.AppendLine("INNER JOIN Empresas empresa ON empresa.Id = contratoEmpresa.EmpresaId");
            builder.AppendLine("INNER JOIN AgentesMedicao agente ON agente.EmpresaId = empresa.Id");
            builder.AppendLine("INNER JOIN PontosMedicao ponto ON ponto.AgenteMedicaoId = agente.Id");
            builder.AppendLine("LEFT OUTER JOIN ConsumosMensais consumo ON consumo.PontoMedicaoId = ponto.Id");
            builder.AppendLine("WHERE");
            builder.AppendLine("    empresa.Ativo = true");
            builder.AppendLine("    AND contrato.Ativo = true");
            builder.AppendLine("    AND contrato.Status = 0");
            builder.AppendLine("    AND contrato.DataExclusao IS NULL");

            builder.AppendLine("    AND (@EmpresaId IS NULL OR empresa.Id = '@EmpresaId')");
            builder.AppendLine("    AND (@DataMedicao IS NULL OR consumo.DataMedicao = '@DataMedicao')");
            builder.AppendLine("    AND (@Periodo IS NULL OR DATE_FORMAT(consumo.MesReferencia, '%Y-%m-01') = '@Periodo')");
            builder.AppendLine("    AND (@StatusMedicao IS NULL OR consumo.StatusMedicao = @StatusMedicao)");

            builder.AppendLine("ORDER BY empresa.NomeFantasia, agente.CodigoPerfilAgente, ponto.Codigo, consumo.MesReferencia DESC");

            string query = builder.ToString()
                .Replace("@EmpresaId", req.EmpresaId?.ToString() ?? "NULL")
                .Replace("@DataMedicao", req.DataMedicao?.ToString("yyyy-MM-dd") ?? "NULL")
                .Replace("@Periodo", req.Periodo?.ToString("yyyy-MM-01") ?? "NULL")
                .Replace("@StatusMedicao", req.StatusMedicao != null ? ((int)req.StatusMedicao).ToString() : "NULL");

            return query;
        }

        public static string ListaMedicoesPorContrato(Guid contratoId, DateTime periodoMedicao)
        {
            StringBuilder builder = new();

            builder.AppendLine("SELECT");
            builder.AppendLine("    empresa.NomeFantasia AS 'DescEmpresa',");
            builder.AppendLine("    medicao.Periodo AS 'DiaMedicao',");
            builder.AppendLine("    agente.Nome AS 'DescAgenteMedicao',");
            builder.AppendLine("    ponto.Codigo AS 'DescPontoMedicao',");
            builder.AppendLine("    medicao.SubTipo,");
            builder.AppendLine("    medicao.Status,");
            builder.AppendLine("    medicao.ConsumoAtivo AS 'TotalConsumoAtivo'");
            builder.AppendLine("FROM Contratos contrato");
            builder.AppendLine("INNER JOIN ContratoEmpresas contratoEmpresa ON contratoEmpresa.ContratoId = contrato.Id");
            builder.AppendLine("INNER JOIN Empresas empresa ON empresa.Id = contratoEmpresa.EmpresaId");
            builder.AppendLine("INNER JOIN AgentesMedicao agente ON agente.EmpresaId = empresa.Id");
            builder.AppendLine("INNER JOIN PontosMedicao ponto ON ponto.AgenteMedicaoId = agente.Id");
            builder.AppendLine("INNER JOIN ConsumosMensais consumo ON consumo.PontoMedicaoId = ponto.Id");
            builder.AppendLine("INNER JOIN Medicoes medicao ON medicao.ConsumoMensalId = consumo.Id");
            builder.AppendLine("WHERE");
            builder.AppendLine("    empresa.Ativo = true");
            builder.AppendLine("    AND contrato.Ativo = true");
            builder.AppendLine("    AND contrato.Status = 0");
            builder.AppendLine("    AND medicao.SubTipo = 'L'");
            builder.AppendLine("    AND contrato.DataExclusao IS NULL");
            builder.AppendLine("    AND contrato.Id = '@ContratoId'");
            builder.AppendLine("    AND DATE_FORMAT(consumo.MesReferencia, '%Y-%m-01') = '@PeriodoMedicao'");
            builder.AppendLine("GROUP BY medicao.Id");
            builder.AppendLine("ORDER BY empresa.NomeFantasia, medicao.Periodo");

            string query = builder.ToString()
                .Replace("@ContratoId", contratoId.ToString())
                .Replace("@PeriodoMedicao", periodoMedicao.ToString("yyyy-MM-01"));

            return query;
        }
    }
}
