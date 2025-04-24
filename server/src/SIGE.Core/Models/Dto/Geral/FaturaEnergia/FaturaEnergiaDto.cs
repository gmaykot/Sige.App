using SIGE.Core.Models.Sistema.Geral.FaturaEnergia;

namespace SIGE.Core.Models.Dto.Geral.FaturaEnergia
{
    public class FaturaEnergiaDto
    {
        public Guid? Id { get; set; }
        public Guid? PontoMedicaoId { get; set; }
        public Guid? ConcessionariaId { get; set; }
        public required DateOnly MesReferencia { get; set; }
        public required DateOnly DataVencimento { get; set; }

        public string? DescPontoMedicao { get; set; }
        public string? DescConcessionaria { get; set; }

        public double? ValorContratadoPonta { get; set; }
        public required double ValorContratadoForaPonta { get; set; }

        public double? ValorFaturadoPonta { get; set; }
        public required double ValorFaturadoForaPonta { get; set; }

        public required double ValorUltrapassagemForaPonta { get; set; }

        public double? ValorReativoPonta { get; set; }
        public required double ValorReativoForaPonta { get; set; }

        public double? ValorConsumoTUSDPonta { get; set; }
        public required double ValorConsumoTUSDForaPonta { get; set; }

        public double? ValorConsumoTEPonta { get; set; }
        public required double ValorConsumoTEForaPonta { get; set; }

        public double? ValorBandeiraPonta { get; set; }
        public required double ValorBandeiraForaPonta { get; set; }

        public double? ValorMedidoReativoPonta { get; set; }
        public required double ValorMedidoReativoForaPonta { get; set; }

        public required double ValorSubvencaoTarifaria { get; set; }

        public IEnumerable<LancamentoAdicionalDto>? LancamentosAdicionais { get; set; }
    }
}
