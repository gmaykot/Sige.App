using SIGE.Core.Models.Dto.Gerencial.Contrato;

namespace SIGE.Core.Models.Dto.Geral.Medicao
{
    public class ResultadoMedicaoDto
    {
        public Guid EmpresaId { get; set; }
        public DateTime DataMedicao { get; set; }
        public required ContratoDto Contrato { get; set; }
    }
}
