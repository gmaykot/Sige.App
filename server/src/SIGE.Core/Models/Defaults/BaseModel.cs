namespace SIGE.Core.Models.Defaults
{
    public class BaseModel
    {
        public Guid Id { get; set; }
        public bool Ativo { get; set; } = true;
        public DateTime? DataExclusao { get; set; }
        public DateTime DataRegistro { get; set; } = DataSige.Hoje();
    }
}
