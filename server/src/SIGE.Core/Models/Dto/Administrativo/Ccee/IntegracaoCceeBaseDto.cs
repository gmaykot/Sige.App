using SIGE.Core.Enumerators;

namespace SIGE.Core.Models.Dto.Administrativo.Ccee
{
    public class IntegracaoCceeBaseDto
    {
        public Guid EmpresaId { get; set; }
        public string? CodAgente { get; set; }
        public string? PontoMedicao { get; set; }
        public string? DescPontoMedicao { get; set; }
        public ETipoMedicaoCcee TipoMedicao { get; set; } = ETipoMedicaoCcee.FINAL;
        public DateTime Periodo { get; set; }
    }
}
