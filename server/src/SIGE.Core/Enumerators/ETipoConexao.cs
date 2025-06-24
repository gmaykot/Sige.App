using SIGE.Core.Attributes;
using System.ComponentModel;

namespace SIGE.Core.Enumerators
{
    public enum ETipoConexao
    {
        [Sigla("A1", "A1 (≥ 230 kV)")]
        A1_230kV,
        [Sigla("A2", "A2 (88 - 138 kV)")]
        A2_88_138kV,
        [Sigla("A3", "A3 (69 kV)")]
        A3_69kV,
        [Sigla("A3a", "A3a (30 - 44 kV)")]
        A3a_30_44kV,
        [Sigla("A4", "A4 (2.3 - 25 kV)")]
        A4_2_25KV,
        [Sigla("AS", "AS (Subterrâneo)")]
        AS,
    }
}
