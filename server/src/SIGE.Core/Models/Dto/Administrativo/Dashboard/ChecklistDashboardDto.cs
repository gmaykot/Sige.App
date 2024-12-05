namespace SIGE.Core.Models.Dto.Administrativo.Dashboard
{
    public class ChecklistDashboardDto
    {
        public required string Motivo { get; set; }
        public required string Link { get; set; }
        public bool Finalizado { get; set; }
        public int Total { get; set; }
    }
}
