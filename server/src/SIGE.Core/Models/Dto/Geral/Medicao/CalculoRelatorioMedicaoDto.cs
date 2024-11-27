namespace SIGE.Core.Models.Dto.Geral.Medicao
{
    public class CalculoRelatorioMedicaoDto
    {
        public required double TotalMedido { get; set; }
        public required double EnergiaContratada { get; set; }
        public required double TakeMinimo { get; set; }
        public required double TakeMaximo { get; set; }
        public required double ValorUnitario { get; set; }
        public required double Proinfa { get; set; }
        public required double Icms { get; set; }
        public double MultiplicadorPerda { get; set; } = 1.03;
    }
}
