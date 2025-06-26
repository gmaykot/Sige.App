using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SIGE.Core.SQLFactory
{
    public static class GerenciamentoMensalFactory
    {
        public static string ListaValoresMensaisPontosMedicao()
        {
            StringBuilder sql = new();

            sql.AppendLine("SELECT");
            sql.AppendLine("    valor.Id,");
            sql.AppendLine("    valor.Proinfa,");
            sql.AppendLine("    valor.Icms,");
            sql.AppendLine("    valor.MesReferencia,");
            sql.AppendLine("    ponto.Nome AS 'DescPontoMedicao',");
            sql.AppendLine("    ponto.Id AS 'PontoMedicaoId',");
            sql.AppendLine("    empresa.NomeFantasia AS 'DescEmpresa'");
            sql.AppendLine("FROM");
            sql.AppendLine("    PontosMedicao ponto");
            sql.AppendLine("INNER JOIN AgentesMedicao agente ON agente.Id = ponto.AgenteMedicaoId");
            sql.AppendLine("INNER JOIN Empresas empresa ON empresa.Id = agente.EmpresaId");
            sql.AppendLine("LEFT JOIN ValoresMensaisPontoMedicao valor ON valor.PontoMedicaoId = ponto.Id AND valor.MesReferencia = {0}");
            sql.AppendLine("ORDER BY");
            sql.AppendLine("    ponto.nome,");
            sql.AppendLine("    empresa.nome;");

            return sql.ToString();
        }

        public static string ListaPisCofins()
        {
            StringBuilder sql = new();

            sql.AppendLine("SELECT");
            sql.AppendLine("    imposto.Id,");
            sql.AppendLine("    imposto.ValorPis AS 'Pis',");
            sql.AppendLine("    imposto.ValorCofins AS 'Cofins',");
            sql.AppendLine("    imposto.MesReferencia,");
            sql.AppendLine("    concessionaria.Id AS 'ConcessionariaId',");
            sql.AppendLine("    concessionaria.Nome AS 'DescConcessionaria'");
            sql.AppendLine("FROM");
            sql.AppendLine("    Concessionarias concessionaria");
            sql.AppendLine("LEFT JOIN ImpostosConcessionarias imposto ON imposto.ConcessionariaId = concessionaria.Id AND imposto.MesReferencia = {0}");
            sql.AppendLine("ORDER BY");
            sql.AppendLine("    concessionaria.Nome;");

            return sql.ToString();
        }
    }
}
