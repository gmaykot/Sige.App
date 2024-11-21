using Newtonsoft.Json;
using SIGE.Core.Converter;
using SIGE.Core.Models.Dto.Medicao;

namespace SIGE.Core.Models.Dto.Ccee
{
    public class IntegracaoCceeDto : IntegracaoCceeBaseDto
    {
        public IntegracaoCceeTotaisDto? Totais { get; set; }
        public IEnumerable<ValoresGraficoDto>? ListaValoresGrafico{ get; set; }
        public IEnumerable<IntegracaoCceeMedidasDto>? ListaMedidas { get; set; }
        public MedicaoDto? medicao { get; set; }
    }

    [JsonConverter(typeof(CustomJsonPathConverter))]
    public class IntegracaoCceeMedidasDto
    {
        public string? PeriodoFinal { get; set; }
        public virtual DateTime Periodo { get; set; }
        public string? PontoMedicao { get; set; }
        public string? DescPontoMedicao { get; set; }
        public string? SubTipo { get; set; }
        public string? Status { get; set; }
        public double ConsumoAtivo { get; set; }
        public double ConsumoReativo { get; set; }
    }

    public class ValoresGraficoDto
    {
        public string? Dia {  get; set; }
        public double? TotalConsumoHCC { get; set; }
        public double? TotalConsumoHIF { get; set; }
    }

    public class IntegracaoCceeTotaisDto
    {
        public double? MediaGeracaoAtiva { get; set; }
        public double? MediaGeracaoReativo { get; set; }
        public double? MediaConsumoAtivo { get; set; }
        public double? MediaConsumoReativo { get; set; }
        public double? SomaGeracaoAtiva { get; set; }
        public double? SomaGeracaoReativo { get; set; }
        public double? SomaConsumoAtivo { get; set; }
        public double? SomaConsumoReativo { get; set; }
        public double? TotalConsumoHIF { get; set; }
        public double? DiasConsumoHIF { get; set; }
        public double? TotalConsumoHCC { get; set; }
        public double? DiasConsumoHCC { get; set; }
    }
}
