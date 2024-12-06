namespace SIGE.Core.Models.Requests
{
    public class RequestContext
    {
        public string Authorization { get; set; } = string.Empty;
        public Guid GestorId { get; set; } = Guid.Empty;
        public Guid UserId { get; set; } = Guid.Empty;
        public string UserName { get; set; } = string.Empty;
    }
}
