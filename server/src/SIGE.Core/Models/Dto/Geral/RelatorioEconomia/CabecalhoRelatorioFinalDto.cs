namespace SIGE.Core.Models.Dto.Geral.RelatorioEconomia
{
    public class CabecalhoRelatorioFinalDto
    {
        public required string Titulo { get; set; }
        public required string SubTitulo { get; set; }
        public required string Unidade { get; set; }
        public required string SubMercado { get; set; }
        public required string Conexao { get; set; }
        public required string Concessao { get; set; }
        public required DateTime DataAnalise { get; set; }
        public required string MesReferencia { get; set; }
        public required int NumerorDiasMes { get; set; }
        public required string PeriodoHoroSazonal { get; set; }
    }
}
