using SIGE.Core.Models.Dto.Medicao;

namespace SIGE.Tests.Unit.Builder.Mock
{
    public class CalculoRelatorioMedicaoDtoMockBuilder : BaseDummyFactory<CalculoRelatorioMedicaoDto>
    {
        public override CalculoRelatorioMedicaoDto Instance => new()
        {
            EnergiaContratada = 101.924,
            Icms = 17,
            Proinfa = 0,
            TakeMaximo = 20,
            TakeMinimo = 20,
            TotalMedido = 99628,
            ValorUnitario = 249.73
        };

        public CalculoRelatorioMedicaoDto CaisInstance => new()
        {
            EnergiaContratada = 385.018,
            Icms = 17,
            Proinfa = 0,
            TakeMaximo = 20,
            TakeMinimo = 20,
            TotalMedido = 562037.76,
            ValorUnitario = 303.08
        };

        public CalculoRelatorioMedicaoDto CotricampoInstance => new()
        {
            EnergiaContratada = 1018.52,
            Icms = 17,
            Proinfa = 0,
            TakeMaximo = 20,
            TakeMinimo = 20,
            TotalMedido = 378575.047,
            ValorUnitario = 349.76
        };

        protected override CalculoRelatorioMedicaoDto Create() => Instance;
    }
}
