using SIGE.Core.Enumerators;

namespace SIGE.Core.Models.Dto.GerenciamentoMensal {
    public class EncargosCCEEDto {
        public Guid? Id;
        public Guid? PontoMedicaoId { get; set; }
        public Guid? TipoEncargoId { get; set; }
        public string? DescEmpresa { get; set; }
        public string? DescPontoMedicao { get; set; }

        public DateTime? MesReferencia { get; set; }
        public string? DesTipoEncargo { get; set; }
        public double Valor { get; set; }
        public ETipoLancamento? Tipo { get; set; }
        public int MesMenos { get; set; }
    }
}
