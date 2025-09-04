using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Sistema.Geral.Economia;
using SIGE.Core.Models.Sistema.Geral.Medicao;

namespace SIGE.Core.Models.Sistema.Administrativo {
    public class LogEnvioEmail : BaseModel {
        public required string Email { get; set; }
        public string? CcoEmail { get; set; }
        public string? Response { get; set; }
        public string? InnerException { get; set; }
        public Guid? UsuarioEnvioId { get; set; }
        public Guid? RelatorioMedicaoId { get; set; }
        public Guid? RelatorioEconomiaId { get; set; }
        public bool Aberto { get; set; } = false;
        public DateTime? DataAbertura { get; set; }

        public UsuarioModel? UsuarioEnvio { get; set; }
        public RelatorioMedicaoModel? RelatorioMedicao { get; set; }
        public RelatorioEconomiaModel? RelatorioEconomia { get; set; }
    }
}
