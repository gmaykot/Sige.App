using System.Text;

namespace SIGE.Core.SQLFactory
{
    public class ContratosFactory
    {
        public static string EmpresasPorContrato(Guid contratoId)
        {
            StringBuilder builder = new StringBuilder();
            builder.Append("SELECT empresa.Id ");
            builder.Append("FROM Contratos contrato ");
            builder.Append("INNER JOIN ContratoEmpresas contratoEmpresa ON contratoEmpresa.ContratoId = contrato.Id ");
            builder.Append("INNER JOIN Empresas empresa on empresa.Id = contratoEmpresa.EmpresaId ");
            builder.Append(string.Format("WHERE contrato.Id = '{0}' ", contratoId));
            return builder.ToString();
        }
    }
}