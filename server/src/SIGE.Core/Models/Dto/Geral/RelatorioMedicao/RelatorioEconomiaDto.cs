using SIGE.Core.Enumerators;
using System.ComponentModel.DataAnnotations.Schema;

namespace SIGE.Core.Models.Dto.Geral.RelatorioMedicao
{
    public class RelatorioEconomiaDto
    {
        public Guid? Id { get; set; }
        public Guid? ContratoId { get; set; }
        public Guid? FornecedorId { get; set; }
        public string? DescGrupo { get; set; }
        public string? NumContrato { get; set; }
        public string? DescFornecedor { get; set; }
        public ETipoEnergia TipoEnergia { get; set; }
        public EFaseMedicao Fase { get; set; }
        public DateTime? Competencia { get; set; }
        public DateTime? DataEmissao { get; set; }
        public DateTime? DataBase { get; set; }
        public DateTime? DataVigenciaInicial { get; set; }
        public DateTime? DataVigenciaFinal { get; set; }
        public decimal? EnergiaContratada { get; set; }
        public decimal? ValorUnitarioKwh { get; set; }
        public decimal? HorasMes { get; set; }
        public decimal? TakeMinimo { get; set; }
        public decimal? TakeMaximo { get; set; }
        public decimal? TotalMedido { get; set; }
        public decimal? Proinfa { get; set; }
        public decimal? Icms { get; set; }
        public string? Observacao { get; set; }
        [NotMapped]
        public ICollection<ValorAnaliticosEconomiaDto>? ValoresAnaliticos { get; set; }
    }
}
