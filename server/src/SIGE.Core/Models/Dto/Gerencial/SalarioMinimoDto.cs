namespace SIGE.Core.Models.Dto.Gerencial
{
    public class SalarioMinimoDto
    {
        public Guid? Id { get; set; }
        public required DateTime VigenciaInicial { get; set; }
        public DateTime? VigenciaFinal { get; set; }
        public required double Valor { get; set; }
    }
}
