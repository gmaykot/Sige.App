using SIGE.Core.Extensions;
using SIGE.Core.Models.Dto.Medicao;

namespace SIGE.Calculos.RelatorioMedicao
{
    public partial class CalculoRelatorioMedicaoService(CalculoRelatorioMedicaoDto calculoRelatorioMedicao)
    {
        private readonly CalculoRelatorioMedicaoDto _calculoRelatorioMedicao = calculoRelatorioMedicao;

        public ResultadoRelatorioMedicaoDto CalcularSintetico() =>
            new()
            {
                ValorProduto = CalculaValorProduto().Round(),
                FaturarLongoPrazo = FaturarLongoPrazo().Round(),
                ComprarCurtoPrazo = ComprarCurtoPrazo().Round(),
                VenderCurtoPrazo = VenderCurtoPrazo().Round(),
                TakeMinimo = CalculaTakeMinimo().Round(),
                TakeMaximo = CalculaTakeMaximo().Round(),
                DentroTake = DentroDoTake(),
                ValorPerdas = CalculaValorPerdas().Round(),
                ValorConsumoTotal = CalculaConsumoTotal().Round(),
                Faturamento = new ()
                { 
                    ValorProduto = CalculaValorProduto().Round(),
                    ValorUnitario = _calculoRelatorioMedicao.ValorUnitario.Round(),
                    ValorNota = (CalculaIcms()+CalculaValorProduto()).Round(),
                    ValorICMS = CalculaIcms().Round(),
                    Quantidade = FaturarLongoPrazo().Round(),                    
                }
            };

        public void CalcularAnalitico() 
        { }
    }
}
