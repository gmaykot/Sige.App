using SIGE.Core.Enumerators;

namespace SIGE.Core.Models.Dto.Menus
{
    public class MenuSistemaDto
    {
        public Guid? Id { get; set; }
        public Guid? MenuPredecessorId { get; set; }
        public string? DescPredecessor { get; set; }
        public required string title { get; set; }
        public string? link { get; set; }
        public string? icon { get; set; }
        public bool? home { get; set; }
        public bool? expanded { get; set; }
        public int ordem { get; set; }
        public required ETipoPerfil Perfil { get; set; }
        public List<MenuSistemaDto>? children { get; set; }
    }
}
