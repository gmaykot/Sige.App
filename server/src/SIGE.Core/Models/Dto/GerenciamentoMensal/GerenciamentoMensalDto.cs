using SIGE.Core.Models.Dto.Gerencial.BandeiraTarifaria;

namespace SIGE.Core.Models.Dto.GerenciamentoMensal {
    public class GerenciamentoMensalDto {
        public DateTime MesReferencia { get; set; }
        public BandeiraTarifariaVigenteDto? BandeiraVigente { get; set; }
        public List<ProinfaIcmsMensalDto>? ProinfaIcms { get; set; }
        public List<PisCofinsMensalDto>? PisCofins { get; set; }
        public List<DescontoTUSDDto>? DescontoTUSD { get; set; }
        public List<GerenciamentoEncargosCCEEDto>? EncargosCCEE { get; set; }
    }
}
