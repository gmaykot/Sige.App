namespace SIGE.Core.Models.Requests
{
    public class RequestContext
    {
        public Guid Authorization { get; set; } = Guid.Empty;
        public Guid GestorId { get; set; } = Guid.Empty;
        public Guid UsuarioId { get; set; } = Guid.Empty;
    }
}
