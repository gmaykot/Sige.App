namespace SIGE.Core.Models.Requests
{
    public class RelatorioEconomiaRequest
    {
        public Guid? PontoMedicaoId { get; set; }
        public DateOnly? MesReferencia { get; set; }
    }
}
