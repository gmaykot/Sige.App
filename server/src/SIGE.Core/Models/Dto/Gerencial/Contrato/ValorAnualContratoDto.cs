namespace SIGE.Core.Models.Dto.Gerencial.Contrato
{
    public class ValorAnualContratoDto
    {
        public Guid? Id { get; set; }
        public Guid? ContratoId { get; set; }
        public DateTime? DataVigenciaInicial { get; set; }
        public DateTime? DataVigenciaFinal { get; set; }
        public required decimal ValorUnitarioKwh { get; set; }
        public IEnumerable<ValorMensalContratoDto>? ValoresMensaisContrato { get; set; }
    }
}
