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
            sql.AppendLine("LEFT JOIN ValoresMensaisPontoMedicao valor ON valor.PontoMedicaoId = ponto.Id AND valor.MesReferencia = @MesReferencia AND valor.Ativo IS true");
            sql.AppendLine("WHERE");
            sql.AppendLine("    ponto.Ativo IS true");
            sql.AppendLine("    AND (@EmpresaId IS NULL OR empresa.Id = @EmpresaId)");
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
            sql.AppendLine("LEFT JOIN ImpostosConcessionarias imposto ON imposto.ConcessionariaId = concessionaria.Id AND imposto.MesReferencia = {0} AND imposto.Ativo IS true");
            sql.AppendLine("WHERE");
            sql.AppendLine("    concessionaria.Ativo IS true");
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
            sql.AppendLine("LEFT JOIN BandeiraTarifariaVigente bandeiraVigente ON bandeiraVigente.BandeiraTarifariaId = bandeira.Id AND bandeiraVigente.MesReferencia = @MesReferencia and bandeiraVigente.Ativo IS true");
            sql.AppendLine("WHERE");
            sql.AppendLine("    bandeira.VigenciaInicial <= @VigenciaInicialFiltro");
            sql.AppendLine("    AND (bandeira.VigenciaFinal IS NULL OR bandeira.VigenciaFinal >= @VigenciaFinalFiltro)");
            sql.AppendLine("    AND bandeira.Ativo IS true;");

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
            sql.AppendLine("    desconto.ValorDescontoTUSD AS 'ValorDescontoTUSD',");
            sql.AppendLine("    desconto.ValorDescontoRETUSD AS 'ValorDescontoRETUSD',");
            sql.AppendLine("    COUNT(agente.EmpresaId) AS 'EmpresasVinculadas'");
            sql.AppendLine("FROM");
            sql.AppendLine("    AgentesMedicao agente");
            sql.AppendLine("LEFT JOIN DescontosTusd desconto ON desconto.AgenteMedicaoId = agente.Id AND desconto.MesReferencia = {0}");
            sql.AppendLine("WHERE");
            sql.AppendLine("    agente.Ativo IS true");
            sql.AppendLine("GROUP BY");
            sql.AppendLine("    agente.CodigoPerfilAgente");
            sql.AppendLine("ORDER BY");
            sql.AppendLine("    agente.Nome;");

            return sql.ToString();
        }

        public static string ObterDescontoTusd()
        {
            var sb = new StringBuilder();
            sb.AppendLine("SELECT ");
            sb.AppendLine("    desconto.Id AS 'Id',");
            sb.AppendLine("    desconto.MesReferencia AS 'MesReferencia',");
            sb.AppendLine("    agente.Id AS 'AgenteMedicaoId',");
            sb.AppendLine("    agente.Nome AS 'DescAgenteMedicao',");
            sb.AppendLine("    agente.CodigoPerfilAgente AS 'CodPerfil',");
            sb.AppendLine("    desconto.ValorDescontoTUSD AS 'ValorDescontoTUSD',");
            sb.AppendLine("    desconto.ValorDescontoRETUSD AS 'ValorDescontoRETUSD',");
            sb.AppendLine("    COUNT(agente.EmpresaId) AS 'EmpresasVinculadas'");
            sb.AppendLine("FROM DescontosTusd AS desconto");
            sb.AppendLine("INNER JOIN AgentesMedicao AS agente ");
            sb.AppendLine("    ON agente.Id = desconto.AgenteMedicaoId");
            sb.AppendLine("INNER JOIN PontosMedicao AS ponto ");
            sb.AppendLine("    ON ponto.AgenteMedicaoId = desconto.AgenteMedicaoId");
            sb.AppendLine("WHERE ponto.Id = @PontoMedicaoId and desconto.MesReferencia = @MesReferencia");
            sb.AppendLine("GROUP BY desconto.MesReferencia, ponto.Id;");

            return sb.ToString();
        }
    }
}
