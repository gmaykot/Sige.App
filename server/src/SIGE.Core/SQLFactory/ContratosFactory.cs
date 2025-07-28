using System.Text;

namespace SIGE.Core.SQLFactory
{
    public class ContratosFactory
    {
        public static string EmpresasPorContrato(Guid contratoId)
        {
            StringBuilder builder = new();

            builder.AppendLine("SELECT empresa.Id");
            builder.AppendLine("FROM Contratos contrato");
            builder.AppendLine("INNER JOIN ContratoEmpresas contratoEmpresa ON contratoEmpresa.ContratoId = contrato.Id");
            builder.AppendLine("INNER JOIN Empresas empresa ON empresa.Id = contratoEmpresa.EmpresaId");
            builder.AppendLine("WHERE contrato.Id = '@ContratoId'");
            builder.AppendLine("    AND contrato.DataExclusao IS NULL");

            string query = builder.ToString()
                .Replace("@ContratoId", contratoId.ToString());

            return query;

        }
    }
}