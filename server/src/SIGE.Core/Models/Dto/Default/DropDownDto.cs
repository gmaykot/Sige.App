namespace SIGE.Core.Models.Dto.Default
{
    public class DropDownDto
    {
        public Guid Id { get; set; }
        public required string Descricao { get; set; }
        public IEnumerable<DropDownDto>? SubGrupo { get; set; }
    }
}
