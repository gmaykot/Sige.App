using System.ComponentModel.DataAnnotations.Schema;
using SIGE.Core.Enumerators;

namespace SIGE.Core.Models.Dto.Geral.RelatorioEconomia {
    public class CabecalhoRelatorioFinalDto {
        [NotMapped]
        public string? Titulo { get; set; }
        public Guid? ContratoId { get; set; }
        [NotMapped]
        public string? SubTitulo { get; set; }
        [NotMapped]
        public string? TarifaFornecimento { get; set; }
        public ETipoSegmento? Segmento { get; set; }
        public required string Unidade { get; set; }
        public required string SubMercado { get; set; }
        public required ETipoConexao Conexao { get; set; }
        public ETipoBandeira? Bandeira { get; set; }
        public required string Concessao { get; set; }
        public string? CNPJ { get; set; }
        public string? InscricaoEstadual { get; set; }
        public string? Endereco { get; set; }
        public string? Municipio { get; set; }
        public string? UF { get; set; }
        [NotMapped]
        public DateTime? DataAnalise { get; set; }
        [NotMapped]
        public string? MesReferencia { get; set; }
        [NotMapped]
        public int? NumerorDiasMes { get; set; }
        [NotMapped]
        public string? PeriodoHoroSazonal { get; set; }
    }
}
