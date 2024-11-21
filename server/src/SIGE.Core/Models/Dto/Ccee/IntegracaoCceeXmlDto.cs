using Newtonsoft.Json;
using SIGE.Core.Converter;

namespace SIGE.Core.Models.Dto.Ccee
{
    [JsonConverter(typeof(CustomJsonPathConverter))]
    public class IntegracaoCceeXmlDto
    {
        [JsonProperty("soapenvBody.bmlistarMedidaResponse.bmmedidas.bmmedida")]
        public required IEnumerable<IntegracaoCceeMedidaXMlsDto> ListaMedidas { get; set; }
    }

    [JsonConverter(typeof(CustomJsonPathConverter))]
    public class IntegracaoCceeMedidaXMlsDto
    {
        [JsonProperty("boperiodo.bofim")]
        public required string PeriodoFinal { get; set; }
        [JsonProperty("bopontoMedicao.bocodigo")]
        public required string PontoMedicao { get; set; }
        [JsonProperty("bosubTipo")]
        public required string SubTipo { get; set; }
        [JsonProperty("bostatus")]
        public required string Status { get; set; }
        [JsonProperty("bogeracaoAtiva")]
        public double GeracaoAtiva { get; set; }
        [JsonProperty("bogeracaoReativo")]
        public double GeracaoReativo { get; set; }
        [JsonProperty("boconsumoAtivo")]
        public double ConsumoAtivo { get; set; }
        [JsonProperty("boconsumoReativo")]
        public double ConsumoReativo { get; set; }
    }
}
