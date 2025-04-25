using SIGE.Core.Enumerators;
using SIGE.Core.Models.Defaults;
using System.ComponentModel.DataAnnotations.Schema;

namespace SIGE.Core.Models.Sistema.Geral.FaturaEnergia
{
    public class LancamentoAdicionalModel : BaseModel
    {
        public required string Descricao { get; set; }
        public required double Valor { get; set; }
        public required ETipoLancamento Tipo { get; set; }

        [ForeignKey("FaturaEnergia")]
        public Guid FaturaEnergiaId { get; set; }

        public virtual FaturaEnergiaModel? FaturaEnergia { get; set; }
    }
}
