using System.Text;

namespace SIGE.Core.SQLFactory
{
    public class ConcessionariasFactory
    {
        public static string ConcessionariasPorPontoMedicao(Guid pontoMedicaoId)
        {
            StringBuilder builder = new StringBuilder();
            builder.Append("SELECT ");
            builder.Append("    concessionaria.Id, ");
            builder.Append("    concessionaria.Nome AS 'Descricao', ");
            builder.Append("    null AS 'Obs' ");
            builder.Append("FROM PontosMedicao ponto ");
            builder.Append("JOIN AgentesMedicao agente ON agente.Id = ponto.AgenteMedicaoId ");
            builder.Append("JOIN Empresas empresa ON empresa.Id = agente.EmpresaId ");
            builder.Append("JOIN ContratoEmpresas contratoEmpresa ON contratoEmpresa.EmpresaId = empresa.Id ");
            builder.Append("JOIN Contratos contrato ON contrato.Id = contratoEmpresa.ContratoId ");
            builder.Append("JOIN Concessionarias concessionaria ON concessionaria.Id = contrato.ConcessionariaId ");
            builder.Append(string.Format("WHERE ponto.Id = '{0}' ", pontoMedicaoId));
            return builder.ToString();
        }
    }
}
