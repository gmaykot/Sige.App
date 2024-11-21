using FakeItEasy;
using SIGE.Calculos.RelatorioMedicao;
using SIGE.Core.Models.Dto.Medicao;
using SIGE.Tests.Unit.Builder.Mock;
using System.Linq.Expressions;

namespace SIGE.Tests.Unit.Builder.Service
{
    public class CalculoRelatorioMedicaoServiceBuilder : BaseMockBuilder<CalculoRelatorioMedicaoService>, IBuilder<CalculoRelatorioMedicaoService>
    {
        private static readonly Expression<Func<CalculoRelatorioMedicaoService, ResultadoRelatorioMedicaoDto>> CalcularSintetico = x => x.CalcularSintetico();

        public ResultadoRelatorioMedicaoDto CalcularSinteticoResult { get; set; } = new ResultadoRelatorioMedicaoDtoMockBuilder().RotaInstance;

        internal override Fake<CalculoRelatorioMedicaoService> BuildMock()
        {
            var mock = new Fake<CalculoRelatorioMedicaoService>();

            mock.CallsTo(CalcularSintetico)
               .WithAnyArguments()
               .Returns(CalcularSinteticoResult);

            return mock;
        }
    }
}
