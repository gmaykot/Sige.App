using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Sistema.Administrativo;
using SIGE.Core.Models.Sistema.Gerencial.Empresa;

namespace SIGE.Core.Models.Sistema.Geral.Economia {
    public class RelatorioEconomiaModel : BaseModel {
        public required DateTime MesReferencia { get; set; }
        public string? Observacao { get; set; }
        public bool? Validado { get; set; } = false;
        public string? ObservacaoValidacao { get; set; }
        public required Guid PontoMedicaoId { get; set; }
        public virtual PontoMedicaoModel? PontoMedicao { get; set; }
        public Guid? UsuarioResponsavelId { get; set; }
        public virtual UsuarioModel? UsuarioResponsavel { get; set; }
    }
}
