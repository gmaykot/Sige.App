namespace SIGE.Core.Models.Dto.Administrativo.Email
{
    public class EmailDataDto
    {
        public Guid? ContratoId { get; set; }
        public required ContatoEmailDto Contato { get; set; }
        public required string Competencia { get; set; }
        public string? DescEmpresa { get; set; }
        public string? DescCompetencia { get; set; }
        public List<string>? Relatorios { get; set; }
        public List<ContatoEmailDto>? ContatosCCO { get; set; }
    }
}
