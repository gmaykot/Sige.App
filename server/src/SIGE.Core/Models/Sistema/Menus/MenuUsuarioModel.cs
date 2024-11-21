using SIGE.Core.Enumerators;
using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Sistema.Usuario;

namespace SIGE.Core.Models.Sistema.Menus
{
    public class MenuUsuarioModel : BaseModel
    {
        public required ETipoPerfil TipoPerfil { get; set; } = ETipoPerfil.CONSULTIVO;
        public required Guid UsuarioId { get; set; }
        public virtual UsuarioModel? Usuario { get; set; }
        public required Guid? MenuSistemaId { get; set; }
        public virtual MenuSistemaModel? MenuSistema { get; set; }
    }
}
