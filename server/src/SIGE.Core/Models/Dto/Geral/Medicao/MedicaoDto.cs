using SIGE.Core.Enumerators;

namespace SIGE.Core.Models.Dto.Geral.Medicao
{
    public class MedicaoDto
    {
        public Guid? Id { get; set; }
        public Guid? EmpresaId { get; set; }
        public Guid? PontoMedicaoId { get; set; }
        public decimal? Icms { get; set; }
        public decimal? Proinfa { get; set; }
        public string? DescEmpresa { get; set; }
        public string? DescAgente { get; set; }
        public string? CodAgente { get; set; }
        public string? PontoMedicao { get; set; }
        public string? DescPontoMedicao { get; set; }
        public DateTime? DataMedicao { get; set; }
        public DateTime? DataVigenciaInicial { get; set; }
        public DateTime? DataVigenciaFinal { get; set; }
        public DateTime? Periodo { get; set; }
        public EStatusMedicao? StatusMedicao { get; set; }
    }
}
