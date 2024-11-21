using SIGE.Core.Models.Dto.Contrato;

namespace SIGE.Core.Models.Dto.Medicao
{
    public class ResultadoMedicaoDto
    {
        public Guid EmpresaId { get; set; }
        public DateTime DataMedicao { get; set; }
        public required ContratoDto Contrato { get; set; }
    }
}
