namespace SIGE.Calculos.RelatorioMedicao
{
    public partial class CalculoRelatorioMedicaoService
    {
        private double CalculaConsumoTotal()
        {
            if (_calculoRelatorioMedicao.TotalMedido.Equals(0))
                return 0;

            var total = _calculoRelatorioMedicao.TotalMedido / 1000;
            return (total * _calculoRelatorioMedicao.MultiplicadorPerda) - _calculoRelatorioMedicao.Proinfa;
        }

        private double CalculaValorProduto() =>
            FaturarLongoPrazo() * _calculoRelatorioMedicao.ValorUnitario;

        private double CalculaTakeMinimo()
        {
            if (_calculoRelatorioMedicao.EnergiaContratada.Equals(0))
                return 0;

            return _calculoRelatorioMedicao.EnergiaContratada - (_calculoRelatorioMedicao.EnergiaContratada * (_calculoRelatorioMedicao.TakeMinimo / 100));
        }

        private double CalculaTakeMaximo()
        {
            if (_calculoRelatorioMedicao.EnergiaContratada.Equals(0))
                return 0;

            return _calculoRelatorioMedicao.EnergiaContratada + (_calculoRelatorioMedicao.EnergiaContratada * (_calculoRelatorioMedicao.TakeMaximo / 100));
        }

        private bool DentroDoTake() =>
            CalculaConsumoTotal() >= CalculaTakeMinimo() && CalculaConsumoTotal() <= CalculaTakeMaximo();

        private double FaturarLongoPrazo()
        {
            if (_calculoRelatorioMedicao.EnergiaContratada.Equals(0))
                return 0;

            if (DentroDoTake())
                return CalculaConsumoTotal();

            var takeMinimoCalculado = CalculaTakeMinimo();
            if (CalculaConsumoTotal() < takeMinimoCalculado)
                return takeMinimoCalculado;

            return CalculaTakeMaximo();
        }

        private double ComprarCurtoPrazo()
        {
            if (CalculaConsumoTotal().Equals(0) || _calculoRelatorioMedicao.EnergiaContratada.Equals(0))
                return 0;

            if (!DentroDoTake() && CalculaConsumoTotal() > FaturarLongoPrazo())
                return CalculaConsumoTotal() - CalculaTakeMaximo();

            return 0;
        }

        private double VenderCurtoPrazo()
        {
            if (CalculaConsumoTotal().Equals(0) || _calculoRelatorioMedicao.EnergiaContratada.Equals(0))
                return 0;

            var longoPrazo = FaturarLongoPrazo();
            if (!DentroDoTake() && CalculaConsumoTotal() < longoPrazo)
                return longoPrazo - CalculaConsumoTotal();

            return 0;
        }

        private double CalculaValorPerdas()
        {
            return (_calculoRelatorioMedicao.TotalMedido * _calculoRelatorioMedicao.MultiplicadorPerda) / 1000;
        }

        private double CalculaIcms() =>
            FaturarLongoPrazo() * (_calculoRelatorioMedicao.ValorUnitario / ((100 - _calculoRelatorioMedicao.Icms) / 100)) - CalculaValorProduto();
            
    }
}
