using SIGE.Core.Attributes;

namespace SIGE.Core.Enumerators
{
    public enum ETipoPerfil
    {
        [StringValue("SUPERUSUARIO")]
        SUPERUSUARIO = 0,
        [StringValue("ADMINISTRATIVO")]
        ADMINISTRATIVO = 1,
        [StringValue("USUARIO")]
        USUARIO = 2,
        [StringValue("CONSULTIVO")]
        CONSULTIVO = 3
    }
}
