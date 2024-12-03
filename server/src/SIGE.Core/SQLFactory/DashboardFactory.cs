using Microsoft.Extensions.Primitives;
using SIGE.Core.Extensions;
using System.Text;

namespace SIGE.Core.SQLFactory
{
    public class DashboardFactory
    {
        public static string ContratosFimVigencia(DateTime mesReferencia)
        {
            StringBuilder builder = new StringBuilder();
            builder.Append("SELECT contrato.Numero AS 'NumContrato', contrato.DscGrupo AS 'DescGrupoEmpresas', contrato.DataVigenciaInicial AS 'VigenciaInicial', contrato.DataVigenciaFinal AS 'VigenciaFinal' ");
            builder.Append("FROM Contratos contrato ");
            builder.Append(string.Format("WHERE MONTH(contrato.DataVigenciaFinal) = {0} and YEAR(contrato.DataVigenciaFinal) = {1} ", mesReferencia.Month, mesReferencia.Year));
            builder.Append("AND contrato.Ativo = true ");
            builder.Append("ORDER BY contrato.DataVigenciaFinal, contrato.DscGrupo ");
            return builder.ToString();
        }

        public static string FaturamentoCoenel(DateTime mesReferencia)
        {
            StringBuilder builder = new StringBuilder();
            builder.Append("SELECT COUNT(*) AS 'Total' ");
            builder.Append("FROM FaturamentosCoenel faturamento ");
            builder.Append(string.Format("WHERE MONTH(faturamento.VigenciaFinal) = {0} and YEAR(faturamento.VigenciaFinal) = {1} ", mesReferencia.Month, mesReferencia.Year));
            builder.Append("AND faturamento.Ativo = true ");
            return builder.ToString();
        }

        public static string ColetaMedicoes(DateTime mesReferencia, bool agrupado = false)
        {
            StringBuilder builder = new StringBuilder();
            builder.Append(string.Format("SELECT COUNT(*) AS 'Total'{0} ", agrupado ? ", consumo.StatusMedicao AS 'Status'" : ""));
            builder.Append("FROM ConsumosMensais consumo ");
            builder.Append(string.Format("WHERE MONTH(consumo.MesReferencia) = {0} ", mesReferencia.Month - 1));
            builder.Append("AND consumo.Ativo = true ");            
            if (agrupado)
                builder.Append("GROUP BY consumo.StatusMedicao ");
            builder.Append("ORDER BY consumo.StatusMedicao");
            return builder.ToString();
        }

        public static string ConsumoMeses(DateTime mesReferencia, int meses)
        {
            var dataInicio = mesReferencia.AddMonths(meses * -1).GetPrimeiraHoraMes();
            var dataFim = mesReferencia.GetUltimaHoraMes();

            StringBuilder builder = new StringBuilder();
            builder.Append("SELECT SUM(medicao.ConsumoAtivo) AS 'ConsumoMensal', CONCAT(MONTH(consumo.MesReferencia),'/',YEAR(consumo.MesReferencia)) as 'DescMes'");
            builder.Append("FROM ConsumosMensais consumo ");
            builder.Append("INNER JOIN Medicoes medicao on medicao.ConsumoMensalId = consumo.Id ");
            builder.Append("WHERE medicao.SubTipo = 'L' and medicao.Status = 'HCC' ");
            builder.Append(string.Format("AND consumo.MesReferencia > '{0}' AND consumo.MesReferencia <= '{1}' ", dataInicio.ToString("yyyy-MM-dd"), dataFim.ToString("yyyy-MM-dd")));
            builder.Append("AND consumo.Ativo = true ");            
            builder.Append("GROUP BY consumo.MesReferencia ");
            builder.Append("ORDER BY consumo.MesReferencia");
            return builder.ToString();
        }

        public static string BandeirasVigentes(DateTime mesReferencia)
        {
            StringBuilder builder = new StringBuilder();
            builder.Append("SELECT COUNT(*) AS 'Total' ");
            builder.Append("FROM BandeiraTarifariaVigente bandeira ");
            builder.Append(string.Format("WHERE MONTH(bandeira.MesReferencia) = {0} ", mesReferencia.Month - 1));
            builder.Append("AND bandeira.Ativo = true ");
            return builder.ToString();
        }
    }
}
