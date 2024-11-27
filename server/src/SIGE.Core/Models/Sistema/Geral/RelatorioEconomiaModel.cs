using SIGE.Core.Enumerators;
using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Sistema.Administrativo;
using SIGE.Core.Models.Sistema.Geral.Medicao;
using SIGE.Core.Models.Sistema.Gerencial.Contrato;

namespace SIGE.Core.Models.Sistema.Geral
{
    public class RelatorioEconomiaModel : BaseModel
    {
        public required DateTime Competencia { get; set; }
        public required DateTime DataEmissao { get; set; }
        public EFaseMedicao Fase { get; set; }
        public required decimal TotalMedido { get; set; }
        public string? Observacao { get; set; }
        public required bool Validado { get; set; } = false;
        public string? ObservacaoValidacao { get; set; }
        public Guid ConsumoMensalId { get; set; }
        public virtual ConsumoMensalModel? ConsumoMensal { get; set; }
        public Guid ContratoId { get; set; }
        public virtual ContratoModel? Contrato { get; set; }
        public Guid UsuarioResponsavelId { get; set; }
        public virtual UsuarioModel? UsuarioResponsavel { get; set; }
    }
}
