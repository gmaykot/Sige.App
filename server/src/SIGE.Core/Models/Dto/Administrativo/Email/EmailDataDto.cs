namespace SIGE.Core.Models.Dto.Administrativo.Email {
    public class EmailDataDto {
        public Guid? ContratoId { get; set; }
        public Guid? RelatorioMedicaoId { get; set; }
        public Guid? RelatorioEconomiaId { get; set; }
        public required ContatoEmailDto Contato { get; set; }
        public required string MesReferencia { get; set; }
        public string? DescEmpresa { get; set; }
        public string? DescMesReferencia { get; set; }
        public List<string>? Relatorios { get; set; }
        public List<ContatoEmailDto>? ContatosCCO { get; set; }
    }
}
