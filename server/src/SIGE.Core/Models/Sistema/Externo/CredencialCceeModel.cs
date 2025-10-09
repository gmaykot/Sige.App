using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Sistema.Administrativo;

namespace SIGE.Core.Models.Sistema.Externo {

    public class CredencialCceeModel : BaseModel {
        public string Nome { get; set; }
        public string AuthUsername { get; set; }
        public string AuthPassword { get; set; }
    }
}