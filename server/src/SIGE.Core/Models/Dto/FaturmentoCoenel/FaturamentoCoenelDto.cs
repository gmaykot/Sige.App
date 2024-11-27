namespace SIGE.Core.Models.Dto.FaturmentoCoenel
{
    public class FaturamentoCoenelDto
    {
        public required Guid? Id { get; set; }
        public string? DescEmpresa { get; set; }
        public required DateTime VigenciaInicial { get; set; }
        public required DateTime VigenciaFinal { get; set; }
        public required double ValorFixo { get; set; }
        public required double QtdeSalarios { get; set; }
        public required double Porcentagem { get; set; }
        public required Guid PontoMedicaoId { get; set; }
        public string? DescPontoMedicao { get; set; }
    }
}
