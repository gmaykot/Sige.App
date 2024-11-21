using SIGE.Core.Attributes;

namespace SIGE.Core.Enumerators
{
    public enum EStatusContrato
    {
        [StringValue("ATIVO")]
        ATIVO = 0,
        [StringValue("INATIVO")]
        INATIVO = 1,
        [StringValue("PENDENTE")]
        PENDENTE = 2,
        [StringValue("ENCERRADO")]
        ENCERRADO = 3,
        [StringValue("FINALIZADO")]
        FINALIZADO = 4
    }
}
