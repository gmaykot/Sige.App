using SIGE.Core.Models.Dto.Geral.RelatorioEconomia;

namespace SIGE.Calculos.RelatorioEconomia
{
    public class CalculoRelatorioEconomiaService
    {
        private IEnumerable<LancamentoRelatorioFinalDto> LancamentosCativo { get; set; }
        private IEnumerable<LancamentoRelatorioFinalDto> LancamentosLivre { get; set; }

        public GrupoRelatorioFinalDto CalculaMercadoCativo()
        {
            var grupo = new GrupoRelatorioFinalDto { Titulo = string.Format($"MERCADO CATIVO - {0} - TOTAL", "A4") };
            return grupo;
        }

        public GrupoRelatorioFinalDto CalculaMercadoLivre()
        {
            var grupo = new GrupoRelatorioFinalDto { Titulo = string.Format($"MERCADO LIVRE - {0}", "A4") };
            return grupo;
        }

        public ComparativoRelatorioFinalDto ComparaMercadoCativoELivre()
        {
            var ret = new ComparativoRelatorioFinalDto();
            return ret;
        }
    }
}
