using SIGE.Core.Models.Dto.Geral.RelatorioMedicao;

namespace SIGE.Services.Services.Geral {
    public class CalculoEconomiaService {
        private RelatorioMedicaoDto? _relatorio;
        private decimal _consumoTotal = 0m;
        private decimal _multiplicadorPerda = 0m;
        private bool _incideIcms = true;
        private ValoresCaltuloMedicaoDto _valoresCaltuloMedicao = new();

        public ValoresCaltuloMedicaoDto? Calcular(RelatorioMedicaoDto relatorio, bool incideIcms) {
            if (relatorio == null)
                return null;

            _multiplicadorPerda = 1 + ((_valoresCaltuloMedicao.ValorPerdasReais ?? 0m) / 100m);

            _relatorio = relatorio;
            _incideIcms = incideIcms;
            CalculaConsumoTotal();
            _valoresCaltuloMedicao = new ValoresCaltuloMedicaoDto {
                ValorProduto = CalculaValorProduto(),
                FaturarLongoPrazo = FaturarLongoPrazo(),
                ComprarCurtoPrazo = ComprarCurtoPrazo(),
                VenderCurtoPrazo = VenderCurtoPrazo(),
                TakeMinimo = CalculaTakeMinimo(),
                TakeMaximo = CalculaTakeMaximo(),
                DentroTake = DentroTake(),
                ValorPerdas = CalculaValorPerdas(),
                ValorConsumoTotal = _consumoTotal,
                ResultadoFaturamento = ResultadoFaturamento()
            };

            return _valoresCaltuloMedicao;
        }

        private decimal CustomTruncate(decimal valor, int casasDecimais = 10) {
            decimal fator = (decimal)Math.Pow(10, casasDecimais);
            return Math.Truncate(valor * fator) / fator;
        }

        public List<ValoresMedicaoAnaliticoDto>? CalcularAnalitico(RelatorioMedicaoDto relatorio, bool incideIcms) {
            if (relatorio == null)
                return null;

            var retorno = new List<ValoresMedicaoAnaliticoDto>();
            var valores = Calcular(relatorio, incideIcms);
            var total3Porcento = _relatorio.TotalMedido * _multiplicadorPerda;

            foreach (var val in relatorio.ValoresAnaliticos) {
                var unitario3Porcento = val.TotalMedido * _multiplicadorPerda;
                var total = CalculaConsumoTotalUnitario(val.TotalMedido, val.Proinfa ?? 0);
                var totalComTake = total / _consumoTotal * valores.ResultadoFaturamento.Quantidade;
                var valorProduto = totalComTake * relatorio.ValorUnitarioKwh;
                var totalIcms = CalculaIcmsUnitario(totalComTake, valorProduto);
                var totalNota = valorProduto + totalIcms;

                var analitico = new ValoresMedicaoAnaliticoDto {
                    NumCnpj = val.NumCnpj ?? string.Empty,
                    DescEmpresa = val.DescEmpresa ?? string.Empty,
                    DescEndereco = val.DescEndereco ?? string.Empty,
                    Quantidade = totalComTake,
                    Unidade = "MWh",
                    ValorUnitario = relatorio.ValorUnitarioKwh,
                    ValorICMS = totalIcms,
                    ValorProduto = valorProduto,
                    ValorNota = totalNota,
                    ComprarCurtoPrazo = CalculaCurtoPrazo(valores.ComprarCurtoPrazo, _relatorio.ValorCompraCurtoPrazo),
                    VenderCurtoPrazo = CalculaCurtoPrazo(valores.VenderCurtoPrazo, _relatorio.ValorVendaCurtoPrazo)
                };

                retorno.Add(analitico);
            }

            return retorno;
        }

        private decimal? CalculaCurtoPrazo(decimal? quantidade, decimal? valorUnitario) {
            var valorProduto = quantidade * valorUnitario;
            var valorIcms = (_relatorio.Icms ?? 0) * (valorProduto / 100.0m);
            var valorNota = valorProduto + (_incideIcms ? valorIcms : 0);
            return valorNota;
        }

        private decimal CalculaValorPerdas() {
            return ((_relatorio.TotalMedido ?? 0) * _multiplicadorPerda) / 1000.0m;
        }

        private decimal CalculaIcms() {
            return FaturarLongoPrazo() *
                   ((_relatorio.ValorUnitarioKwh ?? 0) / ((100m - (_relatorio.Icms ?? 0)) / 100m)) -
                   CalculaValorProduto();
        }

        private decimal? CalculaIcmsUnitario(decimal consumoTotal, decimal? valorProduto) {
            return consumoTotal *
                   ((_relatorio.ValorUnitarioKwh ?? 0) / ((100m - (_relatorio.Icms ?? 0)) / 100m)) -
                   valorProduto;
        }

        private decimal CalculaValorProduto() {
            return CustomTruncate(FaturarLongoPrazo() * (_relatorio.ValorUnitarioKwh ?? 0));
        }

        private decimal CalculaTakeMinimo() {
            return CustomTruncate((_relatorio.EnergiaContratada ?? 0) -
                   ((_relatorio.EnergiaContratada ?? 0) * ((_relatorio.TakeMinimo ?? 0) / 100m)));
        }

        private decimal CalculaTakeMaximo() {
            return CustomTruncate((_relatorio.EnergiaContratada ?? 0) +
                   ((_relatorio.EnergiaContratada ?? 0) * ((_relatorio.TakeMaximo ?? 0) / 100m)));
        }

        private decimal CalculaTakeMaximoSemTruncar() {
            return (_relatorio.EnergiaContratada ?? 0) +
                   ((_relatorio.EnergiaContratada ?? 0) * ((_relatorio.TakeMaximo ?? 0) / 100m));
        }

        private bool DentroTake() {
            var takeMinimo = CalculaTakeMinimo();
            var takeMaximo = CalculaTakeMaximo();
            return _consumoTotal >= takeMinimo && _consumoTotal <= takeMaximo;
        }

        private decimal FaturarLongoPrazo() {
            if (DentroTake()) return _consumoTotal;

            if (_consumoTotal < CalculaTakeMinimo())
                return CalculaTakeMinimo();

            return CalculaTakeMaximo();
        }

        private decimal ComprarCurtoPrazo() {
            if (!DentroTake()) {
                var faturar = FaturarLongoPrazo();
                if (_consumoTotal > faturar)
                    return _consumoTotal - CalculaTakeMaximoSemTruncar();
            }

            return 0.0m;
        }

        private decimal VenderCurtoPrazo() {
            if (!DentroTake()) {
                var faturar = FaturarLongoPrazo();
                if (_consumoTotal < faturar)
                    return faturar - _consumoTotal;
            }

            return 0.0m;
        }

        private FaturamentoMedicaoDto ResultadoFaturamento() {
            return new FaturamentoMedicaoDto {
                Faturamento = "Longo Prazo",
                Quantidade = FaturarLongoPrazo(),
                Unidade = "MWh",
                ValorUnitario = _relatorio.ValorUnitarioKwh,
                ValorICMS = CalculaIcms(),
                ValorProduto = CalculaValorProduto(),
                ValorNota = CalculaIcms() + CalculaValorProduto()
            };
        }

        private void CalculaConsumoTotal() {
            var total = (_relatorio.TotalMedido ?? 0) / 1000.0m;
            _consumoTotal = CustomTruncate(total * _multiplicadorPerda - (_relatorio.Proinfa ?? 0));
        }

        public decimal CalculaConsumoTotalUnitario(decimal totalMedidoKWh, decimal proinfa) {
            return CustomTruncate(totalMedidoKWh / 1000.0m * _multiplicadorPerda - proinfa);
        }
    }
}