namespace SIGE.Core.Options {
    public class CceeOption {
        public required string CertificateValue { get; set; }
        public required string CertificatePass { get; set; }
        public required string BaseUrl { get; set; }
        public required CceeServicesOption ListarMedidas { get; set; }
        public required CceeServicesOption ResultadoRelatorios { get; set; }
    }

    public class CceeServicesOption {
        public required string SoapAction { get; set; }
        public required string Url { get; set; }
    }
}
