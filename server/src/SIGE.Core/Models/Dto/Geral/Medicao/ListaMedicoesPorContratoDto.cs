namespace SIGE.Core.Models.Dto.Geral.Medicao {
    public class ListaMedicoesPorContratoDto {
        public string? DescEmpresa { get; set; }
        public DateTime? DiaMedicao { get; set; }
        public string? DescAgenteMedicao { get; set; }
        public string? DescPontoMedicao { get; set; }
        public string? SubTipo { get; set; }
        public string? Status { get; set; }
        public double? TotalConsumoAtivo { get; set; }
    }
}
