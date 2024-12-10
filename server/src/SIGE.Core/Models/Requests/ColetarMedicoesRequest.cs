namespace SIGE.Core.Models.Requests
{
    public class ColetarMedicoesRequest
    {
        public required DateOnly MesReferencia { get; set; }
        public IEnumerable<int>? ListaEmpresaId { get; set; }
    }
}
