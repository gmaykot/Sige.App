using FluentAssertions;
using SIGE.Calculos.RelatorioMedicao;
using SIGE.Tests.Unit.Builder.Mock;

namespace SIGE.Tests.Unit
{
    public class CalculoRelatorioMedicaoTest
    {
        [Fact]
        public void Rota_Set2024_Take()
        {
            var mockDto = new CalculoRelatorioMedicaoDtoMockBuilder().Instance;
            var mockResultadoDto = new ResultadoRelatorioMedicaoDtoMockBuilder().RotaInstance;
            var instancia = new CalculoRelatorioMedicaoService(mockDto);

            var resultado = instancia.CalcularSintetico();

            resultado.Should().BeEquivalentTo(mockResultadoDto);
        }

        [Fact]
        public void Cais_Set2024_ForaTake_Compra()
        {
            var mockDto = new CalculoRelatorioMedicaoDtoMockBuilder().CaisInstance;
            var mockResultadoDto = new ResultadoRelatorioMedicaoDtoMockBuilder().CaisInstance;
            var instancia = new CalculoRelatorioMedicaoService(mockDto);

            var resultado = instancia.CalcularSintetico();

            resultado.Should().BeEquivalentTo(mockResultadoDto);
        }

        [Fact]
        public void Cotricampo_Set2024_ForaTake_Venda()
        {
            var mockDto = new CalculoRelatorioMedicaoDtoMockBuilder().CotricampoInstance;
            var mockResultadoDto = new ResultadoRelatorioMedicaoDtoMockBuilder().CotricampoInstance;
            var instancia = new CalculoRelatorioMedicaoService(mockDto);

            var resultado = instancia.CalcularSintetico();

            resultado.Should().BeEquivalentTo(mockResultadoDto);
        }
    }
}