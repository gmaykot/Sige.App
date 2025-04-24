using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Sistema.Geral.Medicao;
using SIGE.Core.Models.Sistema.Gerencial.Concessionaria;
using System.ComponentModel.DataAnnotations.Schema;

namespace SIGE.Core.Models.Sistema.Geral.FaturaEnergia
{
    public class FaturaEnergiaModel : BaseModel
    {
        public required DateOnly MesReferencia { get; set; }
        public required DateOnly DataVencimento { get; set; }

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
        
        [ForeignKey("PontoMedicao")]
        public Guid PontoMedicaoId { get; set; }
        [ForeignKey("Concessionaria")]
        public Guid ConcessionariaId { get; set; }

        public virtual PontoMedicaoModel? PontoMedicao { get; set; }
        public virtual ConcessionariaModel? Concessionaria { get; set; }
        public virtual IEnumerable<LancamentoAdicionalModel>? LancamentosAdicionais { get; set; }
    }
}
