using SIGE.Core.Enumerators;

namespace SIGE.Core.Models.Dto.RelatorioEconomia
{
    public class RelatorioEconomiaListDto
    {
        public Guid? Id { get; set; }
        public Guid? FornecedorId { get; set; }
        public Guid? ContratoId { get; set; }
        public string? DescGrupo { get; set; }
        public string? DescFornecedor { get; set; }
        public EFaseMedicao Fase { get; set; }
        public DateTime? Competencia { get; set; }
        public DateTime? DataEmissao { get; set; }
    }
}
