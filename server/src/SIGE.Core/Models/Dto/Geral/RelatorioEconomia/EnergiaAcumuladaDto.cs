namespace SIGE.Core.Models.Dto.Geral.RelatorioEconomia {
    public class EnergiaAcumuladaDto {
        public Guid? Id { get; set; }
        public DateTime? MesReferencia { get; set; }
        public double? ValorMensalAcumulado { get; set; }
        public double? ValorTotalAcumulado { get; set; }
        public Guid? PontoMedicaoId { get; set; }
        public string? PontoMedicaoDesc { get; set; }
        public bool? Ativo { get; set; }
    }
}
