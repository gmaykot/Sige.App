using SIGE.Core.Enumerators;

namespace SIGE.Core.Models.Dto.Source {
    public class TarifaAplicacaoSourceDto {
        public Guid? Id { get; set; }
        public Guid? ConcessionariaId { get; set; }
        public string? DescConcessionaria { get; set; }
        public string? NumeroResolucao { get; set; }
        public ETipoConexao? SubGrupo { get; set; }
        public ETipoSegmento? Segmento { get; set; }
        public DateTime? DataUltimoReajuste { get; set; }
        public bool? Ativo { get; set; }
    }
}
