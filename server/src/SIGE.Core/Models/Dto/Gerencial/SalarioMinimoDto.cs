namespace SIGE.Core.Models.Dto.Gerencial {
    public class SalarioMinimoDto {
        public Guid? Id { get; set; }
        public DateTime? VigenciaInicial { get; set; }
        public DateTime? VigenciaFinal { get; set; }
        public double? Valor { get; set; }
        public bool? Ativo { get; set; }
    }
}
