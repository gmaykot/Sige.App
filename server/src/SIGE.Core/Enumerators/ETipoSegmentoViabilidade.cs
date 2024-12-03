using System.ComponentModel;

namespace SIGE.Core.Enumerators
{
    public enum ETipoSegmentoViabilidade
    {
        [Description("THS Cativo Verde")]
        VERDE_CATIVO,
        [Description("Mercado Livre TUSD 0% Verde")]
        VERDE_ZERO,
        [Description("Mercado Livre TUSD 50% Verde")]
        VERDE_CINQUENTA,
        [Description("Mercado Livre TUSD 100% Verde")]
        VERDE_CEM,
        [Description("THS Cativo Azul")]
        AZUL_CATIVO,
        [Description("Mercado Livre TUSD 0% Azul")]
        AZUL_ZERO,
        [Description("Mercado Livre TUSD 50% Azul")]
        AZUL_CINQUENTA,
        [Description("Mercado Livre TUSD 100% Azul")]
        AZUL_CEM
    }
}
