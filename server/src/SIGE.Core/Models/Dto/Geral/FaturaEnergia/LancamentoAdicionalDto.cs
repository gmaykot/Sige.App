using SIGE.Core.Enumerators;

namespace SIGE.Core.Models.Dto.Geral.FaturaEnergia
{
    public class LancamentoAdicionalDto
    {
        public Guid? Id { get; set; }
        public Guid? FaturaEnergiaId { get; set; }

        public required string Descricao { get; set; }
        public required double Valor { get; set; }
        public required ETipoLancamento Tipo { get; set; }
        public required ETipoNaturezaMercado NaturezaMercado { get; set; }
        public required bool ContabilizaFatura { get; set; } = false;
        public required bool TipoCCEE { get; set; } = false;
    }
}
