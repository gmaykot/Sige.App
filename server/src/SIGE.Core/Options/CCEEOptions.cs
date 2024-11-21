namespace SIGE.Core.Options
{
    public class CceeOptions
    {
        public required string CertificateValue { get; set; }
        public required string BaseUrl { get; set; }
        public required CceeServicesOptions ListarMedidas { get; set; }
    }

    public class CceeServicesOptions {
        public required string SoapAction { get; set; }
        public required string Url { get; set; }
    }
}
