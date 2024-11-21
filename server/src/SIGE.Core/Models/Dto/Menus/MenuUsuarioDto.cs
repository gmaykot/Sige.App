using SIGE.Core.Enumerators;

namespace SIGE.Core.Models.Dto.Menus
{
    public class MenuUsuarioDto
    {
        public required Guid? Id { get; set; }
        public required string DescMenu { get; set; }
        public string? DescPredecessor { get; set; }
        public required ETipoPerfil TipoPerfil { get; set; } = ETipoPerfil.CONSULTIVO;
        public required Guid UsuarioId { get; set; }
        public required Guid MenuSistemaId { get; set; }
    }
}
