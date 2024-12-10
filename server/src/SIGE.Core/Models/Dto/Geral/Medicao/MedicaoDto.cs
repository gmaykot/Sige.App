using SIGE.Core.Enumerators;

namespace SIGE.Core.Models.Dto.Geral.Medicao
{
    public class MedicaoDto
    {
        //Agente
        public string? DescAgente { get; set; }
        public string? CodAgente { get; set; }
        //Empresa
        public Guid? EmpresaId { get; set; }
        public string? DescEmpresa { get; set; }
        //Consumo Mensal
        public Guid? Id { get; set; }
        public decimal? Icms { get; set; }
        public decimal? Proinfa { get; set; }
        public DateTime? DataMedicao { get; set; }
        public DateTime? Periodo { get; set; }
        public EStatusConsumoMensal? Status { get; set; }
        //Contrato
        public DateTime? DataVigenciaInicial { get; set; }
        public DateTime? DataVigenciaFinal { get; set; }
        //Ponto de Medição
        public Guid? PontoMedicaoId { get; set; }
        public string? PontoMedicao { get; set; }
        public string? DescPontoMedicao { get; set; }        
    }
}
