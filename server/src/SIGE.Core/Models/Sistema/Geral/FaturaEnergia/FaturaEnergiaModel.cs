using SIGE.Core.Enumerators;
using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Sistema.Gerencial.Concessionaria;
using SIGE.Core.Models.Sistema.Gerencial.Empresa;
using System.ComponentModel.DataAnnotations.Schema;

namespace SIGE.Core.Models.Sistema.Geral.FaturaEnergia
{
    public class FaturaEnergiaModel : BaseModel
    {
        public required DateOnly MesReferencia { get; set; }
        public required DateOnly DataVencimento { get; set; }
        public required ETipoSegmento Segmento { get; set; } = ETipoSegmento.VERDE;
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

        [ForeignKey("PontoMedicao")]
        public Guid PontoMedicaoId { get; set; }
        [ForeignKey("Concessionaria")]
        public Guid ConcessionariaId { get; set; }

        public virtual PontoMedicaoModel? PontoMedicao { get; set; }
        public virtual ConcessionariaModel? Concessionaria { get; set; }
        public virtual IEnumerable<LancamentoAdicionalModel>? LancamentosAdicionais { get; set; }
    }
}
