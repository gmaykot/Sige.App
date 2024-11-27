namespace SIGE.Core.Models.Dto.Gerencial
{
    public class SalarioMinimoDto
    {
        public Guid? Id { get; set; }
        public required DateTime MesReferencia { get; set; }
        public required double Valor { get; set; }
    }
}
