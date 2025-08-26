namespace SIGE.Core.Models.Dto.GerenciamentoMensal {
    public class ProinfaIcmsMensalDto {
        public Guid? Id { get; set; }
        public double? Proinfa { get; set; }
        public double? Icms { get; set; }
        public double? ValorDescontoRETUSD { get; set; }
        public DateOnly? MesReferencia { get; set; }
        public string? DescPontoMedicao { get; set; }
        public Guid PontoMedicaoId { get; set; }
        public string? DescEmpresa { get; set; }
    }
}
