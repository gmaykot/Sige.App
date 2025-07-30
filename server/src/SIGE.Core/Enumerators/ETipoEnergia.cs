using System.ComponentModel;

namespace SIGE.Core.Enumerators {
    public enum ETipoEnergia {
        [Description("I0 (LP)")]
        I0_LP,
        [Description("I1 (LP)")]
        I1_LP,
        [Description("I5 (LP)")]
        I5_LP,
        [Description("Convencional (LP)")]
        CONVENCIONAL_LP,

        NA = 99,
    }
}
