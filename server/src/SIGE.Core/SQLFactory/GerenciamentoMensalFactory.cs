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

        public static string ObterBandeiraMesReferencia()
        {
            StringBuilder sql = new();

            sql.AppendLine("SELECT");
            sql.AppendLine("    bandeiraVigente.Id,");
            sql.AppendLine("    bandeiraVigente.MesReferencia,");
            sql.AppendLine("    bandeiraVigente.Bandeira,");
            sql.AppendLine("    bandeira.Id AS 'BandeiraTarifariaId'");
            sql.AppendLine("FROM");
            sql.AppendLine("    BandeirasTarifarias bandeira");
            sql.AppendLine("LEFT JOIN BandeiraTarifariaVigente bandeiraVigente ON bandeiraVigente.BandeiraTarifariaId = bandeira.Id AND bandeiraVigente.MesReferencia = @MesReferenciaBV");
            sql.AppendLine("WHERE");
            sql.AppendLine("    bandeira.VigenciaInicial <= @VigenciaInicialFiltro");
            sql.AppendLine("    AND (bandeira.VigenciaFinal IS NULL OR bandeira.VigenciaFinal >= @VigenciaFinalFiltro);");

            return sql.ToString();
        }

        public static string ListaDescontoTusd()
        {
            StringBuilder sql = new();

            sql.AppendLine("SELECT");
            sql.AppendLine("    desconto.Id AS 'Id',");
            sql.AppendLine("    desconto.MesReferencia AS 'MesReferencia',");
            sql.AppendLine("    agente.Id AS 'AgenteMedicaoId',");
            sql.AppendLine("    agente.Nome AS 'DescAgenteMedicao',");
            sql.AppendLine("    agente.CodigoPerfilAgente AS 'CodPerfil',");
            sql.AppendLine("    desconto.ValorDesconto AS 'DescontoTUSD',");
            sql.AppendLine("    COUNT(agente.EmpresaId) AS 'EmpresasVinculadas'");
            sql.AppendLine("FROM");
            sql.AppendLine("    AgentesMedicao agente");
            sql.AppendLine("LEFT JOIN DescontosTusd desconto ON desconto.AgenteMedicaoId = agente.Id AND desconto.MesReferencia = {0}");
            sql.AppendLine("GROUP BY");
            sql.AppendLine("    agente.CodigoPerfilAgente");
            sql.AppendLine("ORDER BY");
            sql.AppendLine("    agente.Nome;");

            return sql.ToString();
        }
    }
}
