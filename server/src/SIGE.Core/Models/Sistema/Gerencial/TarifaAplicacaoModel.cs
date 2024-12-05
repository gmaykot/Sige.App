using SIGE.Core.Enumerators;
using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Sistema.Gerencial.Concessionaria;

namespace SIGE.Core.Models.Sistema.Gerencial
{
    public class TarifaAplicacaoModel : BaseModel
    {
        public Guid ConcessionariaId { get; set; }
        public virtual ConcessionariaModel? Concessionaria { get; set; }
        public required string NumeroResolucao { get; set; }
        public required ESubGrupo SubGrupo { get; set; }
        public required ETipoSegmento Segmento { get; set; }
        public DateTime DataUltimoReajuste { get; set; }
        public required decimal KWPonta { get; set; }
        public required decimal KWForaPonta { get; set; }
        public required decimal KWhPontaTUSD { get; set; }
        public required decimal KWhForaPontaTUSD { get; set; }
        public required decimal KWhPontaTE { get; set; }
        public required decimal KWhForaPontaTE { get; set; }
        public required decimal ReatKWhPFTE { get; set; }
    }
}
