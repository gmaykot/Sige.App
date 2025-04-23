using System.Text;

namespace SIGE.Core.SQLFactory
{
    public class ConcessionariasFactory
    {
        public static string ConcessionariasPorPontoMedicao(Guid pontoMedicaoId)
        {
            StringBuilder builder = new StringBuilder();
            builder.Append(@"Select
                                concessionaria.Id, concessionaria.Nome AS 'Descricao'
                            FROM PontosMedicao ponto
                            JOIN AgentesMedicao agente ON agente.id = ponto.AgenteMedicaoId
                            JOIN Empresas empresa ON empresa.Id = agente.EmpresaId
                            JOIN ContratoEmpresas contratoEmpresa ON contratoEmpresa.EmpresaId = empresa.Id
                            JOIN Contratos contrato ON contrato.Id = contratoEmpresa.ContratoId
                            JOIN Concessionarias concessionaria ON concessionaria.Id = contrato.ConcessionariaId ");
            builder.Append(string.Format("WHERE ponto.Id = '{0}' ", pontoMedicaoId));
            return builder.ToString();
        }
    }
}
