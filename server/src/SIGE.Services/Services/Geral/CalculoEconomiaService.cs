using SIGE.Core.Models.Dto.Geral.RelatorioMedicao;

public class CalculoEconomiaService
{
    private RelatorioMedicaoDto? _relatorio;
    private decimal _consumoTotal = 0m;
    private decimal _multiplicadorPerda = 1.03m;

    public ValoresCaltuloMedicaoDto Calcular(RelatorioMedicaoDto relatorio)
    {
        if (relatorio == null)
            return null;

        _relatorio = relatorio;
        CalculaConsumoTotal();

        return new ValoresCaltuloMedicaoDto
        {
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
    }

    public List<ValoresMedicaoAnaliticoDto> CalcularAnalitico(RelatorioMedicaoDto relatorio)
    {
        if (relatorio == null)
            return null;

        var retorno = new List<ValoresMedicaoAnaliticoDto>();
        var valores = Calcular(relatorio);
        var total3Porcento = _relatorio.TotalMedido * 1.03m;

        foreach (var val in relatorio.ValoresAnaliticos)
        {
            if (val.TotalMedido == null)
                val.TotalMedido = 0m;

            var unitario3Porcento = val.TotalMedido * (decimal)1.03;
            var total = CalculaConsumoTotalUnitario(val.TotalMedido, val.Proinfa.Value);
            var totalComTake = (total / _consumoTotal) * valores.ResultadoFaturamento.Quantidade;
            var valorProduto = totalComTake * relatorio.ValorUnitarioKwh;
            var totalIcms = CalculaIcmsUnitario(totalComTake, valorProduto);
            var totalNota = valorProduto + totalIcms;

            var analitico = new ValoresMedicaoAnaliticoDto
            {
                NumCnpj = val.NumCnpj,
                DescEmpresa = val.DescEmpresa,
                DescEndereco = val.DescEndereco,
                Quantidade = totalComTake,
                Unidade = "MWh",
                ValorUnitario = relatorio.ValorUnitarioKwh,
                ValorICMS = totalIcms,
                ValorProduto = valorProduto,
                ValorNota = totalNota,
                ComprarCurtoPrazo = CurtoPrazoUnitario(total3Porcento, unitario3Porcento, valores.ComprarCurtoPrazo),
                VenderCurtoPrazo = CurtoPrazoUnitario(total3Porcento, unitario3Porcento, valores.VenderCurtoPrazo)
            };

            retorno.Add(analitico);
        }

        return retorno;
    }

    private decimal CalculaValorPerdas()
    {
        return (_relatorio.TotalMedido.Value * _multiplicadorPerda) / 1000.0m;
    }

    private decimal CalculaIcms()
    {
        return FaturarLongoPrazo() *
               (_relatorio.ValorUnitarioKwh.Value / ((100m - _relatorio.Icms.Value) / 100m)) -
               CalculaValorProduto();
    }

    private decimal? CalculaIcmsUnitario(decimal consumoTotal, decimal? valorProduto)
    {
        return consumoTotal *
               (_relatorio.ValorUnitarioKwh.Value / ((100m - _relatorio.Icms.Value) / 100m)) -
               valorProduto;
    }

    private decimal CalculaValorProduto()
    {
        return FaturarLongoPrazo() * _relatorio.ValorUnitarioKwh.Value;
    }

    private decimal CalculaTakeMinimo()
    {
        return _relatorio.EnergiaContratada.Value -
               (_relatorio.EnergiaContratada.Value * (_relatorio.TakeMinimo.Value / 100m));
    }

    private decimal CalculaTakeMaximo()
    {
        return _relatorio.EnergiaContratada.Value +
               (_relatorio.EnergiaContratada.Value * (_relatorio.TakeMaximo.Value / 100m));
    }

    private bool DentroTake()
    {
        var takeMinimo = CalculaTakeMinimo();
        var takeMaximo = CalculaTakeMaximo();
        return _consumoTotal >= takeMinimo && _consumoTotal <= takeMaximo;
    }

    private decimal FaturarLongoPrazo()
    {
        if (DentroTake()) return _consumoTotal;

        if (_consumoTotal < CalculaTakeMinimo())
            return CalculaTakeMinimo();

        return CalculaTakeMaximo();
    }

    private decimal ComprarCurtoPrazo()
    {
        if (!DentroTake())
        {
            var faturar = FaturarLongoPrazo();
            if (_consumoTotal > faturar)
                return _consumoTotal - CalculaTakeMaximo();
        }

        return 0.0m;
    }

    private decimal VenderCurtoPrazo()
    {
        if (!DentroTake())
        {
            var faturar = FaturarLongoPrazo();
            if (_consumoTotal < faturar)
                return faturar - _consumoTotal;
        }

        return 0.0m;
    }

    private FaturamentoMedicaoDto ResultadoFaturamento()
    {
        return new FaturamentoMedicaoDto
        {
            Faturamento = "Longo Prazo",
            Quantidade = FaturarLongoPrazo(),
            Unidade = "MWh",
            ValorUnitario = _relatorio.ValorUnitarioKwh,
            ValorICMS = CalculaIcms(),
            ValorProduto = CalculaValorProduto(),
            ValorNota = CalculaIcms() + CalculaValorProduto()
        };
    }

    private void CalculaConsumoTotal()
    {
        var total = _relatorio.TotalMedido.Value / 1000.0m;
        _consumoTotal = (total * 1.03m) - _relatorio.Proinfa.Value;
    }

    public decimal CalculaConsumoTotalUnitario(decimal totalMedidoKWh, decimal proinfa)
    {
        return (totalMedidoKWh / 1000.0m * 1.03m) - proinfa;
    }

    public decimal CurtoPrazoUnitario(decimal? totalGeral, decimal? totalUnitario, decimal? valorGeral)
    {
        if (valorGeral > 0)
            return (totalUnitario.Value / totalGeral.Value) * valorGeral.Value;
        return 0.0m;
    }
}
