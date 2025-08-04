using SIGE.Core.Enumerators;

namespace SIGE.Core.Models.Dto.GerenciamentoMensal {
    public class DescontoTUSDDto {
        public Guid? Id { get; set; }
        public DateOnly? MesReferencia { get; set; }
        public Guid FornecedorId { get; set; }
        public string? DescFornecedor { get; set; }
        public double? ValorDescontoTUSD { get; set; }
        public double? ValorDescontoRETUSD { get; set; }
        public ETipoEnergia TipoEnergia { get; set; }
    }
}
