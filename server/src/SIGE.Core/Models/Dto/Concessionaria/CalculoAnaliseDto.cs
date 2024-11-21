namespace SIGE.Core.Models.Dto.Concessionaria
{
    public class CalculoAnaliseDto
    {
        public required string TipoSegmento { get; set; }
        public double KWhPonta { get; set; }
        public double KWhFPonta { get; set; }
        public double Total { get; set; }
        public double TotalAno { get; set; }
        public double MediaMes { get; set; }
        public double MediaMesMwh { get; set; }

        #region Cálculo Mercado Cativo
        public double? DemPonta { get; set; }
        public double? DemFPonta { get; set; }
        public double? DemUltPonta { get; set; }
        public double? DemUltFPonta { get; set; }
        #endregion

        #region Cálculo Mercado Livre
        public double? EncConexao { get; set; }
        public double? EssEncServicoSist { get; set; }
        public double? CusdPonta { get; set; }
        public double? CusdFPonta { get; set; }
        public double? TusdPonta { get; set; }
        public double? TusdFPonta { get; set; }
        public double? TusdPFPonta { get; set; }
        #endregion
    }
}
