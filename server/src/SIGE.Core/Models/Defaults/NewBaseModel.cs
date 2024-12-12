using System.ComponentModel.DataAnnotations;

namespace SIGE.Core.Models.Defaults
{
    public class NewBaseModel
    {
        [Key]
        public int Id { get; set; }
        public bool Ativo { get; set; } = true;
        public DateOnly? DataExclusao { get; set; }
        public DateOnly DataRegistro { get; set; } = DateOnly.FromDateTime(DateTime.Now);
    }
}
