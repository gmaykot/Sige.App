namespace SIGE.Core.Models.Dto.GerenciamentoMensal {
    public class GerenciamentoEncargosCCEEDto {
        public DateTime? MesReferencia { get; set; }
        public string? DescEmpresa { get; set; }
        public string? DescPontoMedicao { get; set; }
        public Guid? PontoMedicaoId { get; set; }
        public List<EncargosCCEEDto>? EncargosCCEE { get; set; }
    }
}
