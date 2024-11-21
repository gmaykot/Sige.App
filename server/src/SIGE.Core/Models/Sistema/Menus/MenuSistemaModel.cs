using SIGE.Core.Models.Defaults;

namespace SIGE.Core.Models.Sistema.Menus
{
    public class MenuSistemaModel : BaseModel
    {
        public required string Titulo { get; set; }
        public string? Link { get; set; }
        public string? Icone { get; set; }
        public bool? Home { get; set; }
        public bool? Expandido { get; set; }
        public int Ordem { get; set; }
        public Guid? MenuPredecessorId { get; set; }
        public MenuSistemaModel? MenuPredecessor { get; set; }
    }
}
