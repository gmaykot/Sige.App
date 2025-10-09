namespace SIGE.Core.Models.Requests {

    public class RequestContext {
        public Guid Authorization { get; set; } = Guid.Empty;
        public Guid UsuarioId { get; set; } = Guid.Empty;
        public string Usuario { get; set; } = string.Empty;
    }
}