using SIGE.Core.Models.Dto.Source;

namespace SIGE.Core.Models.Dto.Gerencial {
    public class TarifaAplicacaoDto : TarifaAplicacaoSourceDto {
        public decimal? KWPonta { get; set; }
        public decimal? KWForaPonta { get; set; }
        public decimal? KWhPontaTUSD { get; set; }
        public decimal? KWhForaPontaTUSD { get; set; }
        public decimal? KWhPontaTE { get; set; }
        public decimal? KWhForaPontaTE { get; set; }
        public decimal? ReatKWhPFTE { get; set; }
    }
}
