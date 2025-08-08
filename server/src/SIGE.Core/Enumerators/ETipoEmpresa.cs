using System.ComponentModel;

namespace SIGE.Core.Enumerators {
    public enum ETipoEmpresa {
        [Description("Atacadista")]
        ATACADISTA,
        [Description("Varejista")]
        VAREJISTA,
        [Description("Sem Cadastro")]
        ND = 9,
    }
}
