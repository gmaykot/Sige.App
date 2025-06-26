namespace SIGE.Core.Models.Dto.Geral
{
    public class ValorMensalPontoMedicaoDto
    {
        public required Guid? Id { get; set; }
        public required DateTime MesReferencia { get; set; }
        public required double Proinfa { get; set; }
        public required double Icms { get; set; }

        public required Guid PontoMedicaoId { get; set; }
        public string? DescPontoMedicao { get; set; }

    }
}
