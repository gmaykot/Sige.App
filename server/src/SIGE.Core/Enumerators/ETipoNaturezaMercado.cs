using SIGE.Core.Attributes;

namespace SIGE.Core.Enumerators
{
    public enum ETipoNaturezaMercado
    {
        [StringValue("CATIVO")]
        CATIVO = 0,
        [StringValue("LIVRE")]
        LIVRE = 1,
        [StringValue("CATIVO/LIVRE")]
        CATIVO_LIVRE = 2,
    }
}
