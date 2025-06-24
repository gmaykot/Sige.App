using SIGE.Core.Enumerators;

namespace SIGE.Core.Models.Dto.Gerencial
{
    public class TarifaAplicacaoDto
    {
        public Guid? Id { get; set; }
        public Guid? ConcessionariaId { get; set; }
        public string? DescConcessionaria { get; set; }
        public required string NumeroResolucao { get; set; }
        public required ETipoConexao SubGrupo { get; set; }
        public required ETipoSegmento Segmento { get; set; }
        public DateTime DataUltimoReajuste { get; set; }
        public required decimal KWPonta { get; set; }
        public required decimal KWForaPonta { get; set; }
        public required decimal KWhPontaTUSD { get; set; }
        public required decimal KWhForaPontaTUSD { get; set; }
        public required decimal KWhPontaTE { get; set; }
        public required decimal KWhForaPontaTE { get; set; }
        public required decimal ReatKWhPFTE { get; set; }
    }
}
