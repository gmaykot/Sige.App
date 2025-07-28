using SIGE.Core.Enumerators;

namespace SIGE.Core.Models.Dto.Geral.FaturaEnergia
{
    public class FaturaEnergiaDto
    {
        public Guid? Id { get; set; }
        public Guid? PontoMedicaoId { get; set; }
        public string? PontoMedicaoDesc { get; set; }
        public Guid? ConcessionariaId { get; set; }
        public string? ConcessionariaDesc { get; set; }
        public required DateOnly MesReferencia { get; set; }
        public required DateOnly DataVencimento { get; set; }
        public required ETipoSegmento Segmento { get; set; }
        public bool Validado { get; set; } = false;

        #region Demanda
        public double? ValorDemandaContratadaPonta { get; set; }
        public required double ValorDemandaContratadaForaPonta { get; set; }

        public double? ValorDemandaFaturadaPontaConsumida { get; set; }
        public required double ValorDemandaFaturadaForaPontaConsumida { get; set; }

        public double? ValorDemandaFaturadaPontaNaoConsumida { get; set; }
        public required double ValorDemandaFaturadaForaPontaNaoConsumida { get; set; }

        public required double ValorDemandaUltrapassagemPonta { get; set; }
        public required double ValorDemandaUltrapassagemForaPonta { get; set; }

        public double? ValorDemandaReativaPonta { get; set; }
        public required double ValorDemandaReativaForaPonta { get; set; }
        #endregion

        #region Consumo
        public double? ValorConsumoTUSDPonta { get; set; }
        public required double ValorConsumoTUSDForaPonta { get; set; }

        public double? ValorConsumoTEPonta { get; set; }
        public required double ValorConsumoTEForaPonta { get; set; }

        public double? ValorConsumoMedidoReativoPonta { get; set; }
        public required double ValorConsumoMedidoReativoForaPonta { get; set; }
        #endregion

        #region Tarifa, TUSD e RETUSD
        public double? TarifaMedidaReativaPonta { get; set; }
        public required double TarifaMedidaReativaForaPonta { get; set; }

        public required double ValorDescontoTUSD { get; set; }
        public required double ValorDescontoRETUSD { get; set; }
        #endregion

        public IEnumerable<LancamentoAdicionalDto>? LancamentosAdicionais { get; set; }
    }
}
