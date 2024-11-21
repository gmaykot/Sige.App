using SIGE.Core.Models.Dto.Medicao;

namespace SIGE.Tests.Unit.Builder.Mock
{
    public class ResultadoRelatorioMedicaoDtoMockBuilder
    {
        public ResultadoRelatorioMedicaoDto RotaInstance => new()
        {
            ComprarCurtoPrazo = 0,
            DentroTake = true,
            FaturarLongoPrazo = 102.6168,
            TakeMaximo = 122.3088,
            TakeMinimo = 81.5392,
            ValorConsumoTotal = 102.6168,
            ValorPerdas = 102.6168,
            ValorProduto = 25626.5035,
            VenderCurtoPrazo = 0,
            Faturamento = new()
            {
                Quantidade = 102.6168,
                ValorICMS = 5248.8019,
                ValorNota = 30875.3054,
                ValorProduto = 25626.5035,
                ValorUnitario = 249.73
            }
        };

        public ResultadoRelatorioMedicaoDto CaisInstance => new()
        {
            ComprarCurtoPrazo = 116.8773,
            DentroTake = false,
            FaturarLongoPrazo = 462.0216,
            TakeMaximo = 462.0216,
            TakeMinimo = 308.0144,
            ValorConsumoTotal = 578.8989,
            ValorPerdas = 578.8989,
            ValorProduto = 140029.5065,
            VenderCurtoPrazo = 0,
            Faturamento = new()
            {
                Quantidade = 462.0216,
                ValorICMS = 28680.7423,
                ValorNota = 168710.2488,
                ValorProduto = 140029.5065,
                ValorUnitario = 303.08
            }
        };

        public ResultadoRelatorioMedicaoDto CotricampoInstance => new()
        {
            ComprarCurtoPrazo = 0,
            DentroTake = false,
            FaturarLongoPrazo = 814.816,
            TakeMaximo = 1222.224,
            TakeMinimo = 814.816,
            ValorConsumoTotal = 389.9323,
            ValorPerdas = 389.9323,
            ValorProduto = 284990.0442,
            VenderCurtoPrazo = 424.8837,
            Faturamento = new()
            {
                Quantidade = 814.816,
                ValorICMS = 58371.4548,
                ValorNota = 343361.4990,
                ValorProduto = 284990.0442,
                ValorUnitario = 349.76
            }
        };
    }
}
