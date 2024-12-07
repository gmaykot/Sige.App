namespace SIGE.Core.Models.Dto.Gerencial.Contrato
{
    public class ValorMensalContratoDto
    {
        public Guid? Id { get; set; }
        public Guid? ValorAnualContratoId { get; set; }
        public DateTime? MesReferencia { get; set; }
        public decimal HorasMes { get; set; }
        public decimal EnergiaContratada { get; set; }
    }
}
