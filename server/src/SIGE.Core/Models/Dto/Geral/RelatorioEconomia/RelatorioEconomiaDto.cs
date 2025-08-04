namespace SIGE.Core.Models.Dto.Geral.RelatorioMedicao {
    public class RelatorioEconomiaDto {
        public Guid? Id { get; set; }
        public Guid? PontoMedicaoId { get; set; }
        public string? DescPontoMedicao { get; set; }
        public DateTime? MesReferencia { get; set; }
        public string? Observacao { get; set; }
        public string? ObservacaoValidacao { get; set; }
        public bool? Validado { get; set; }
    }
}
