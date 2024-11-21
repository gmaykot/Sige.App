namespace SIGE.Services.HttpConfiguration.Ccee
{
    public class CceeHttpClient : IHttpClient<CceeHttpClient>
    {
        private readonly HttpClient _httpClient;

        public CceeHttpClient(HttpClient httpClient) => _httpClient = httpClient;

        public Task<HttpResponseMessage> SendAsync(HttpRequestMessage req) =>
            _httpClient.SendAsync(req);

        public Task<HttpResponseMessage> PostAsync(string requestUri, HttpContent content) =>
            _httpClient.PostAsync(requestUri, content);

        public void AddHeader(string header, string value) =>
            _httpClient.DefaultRequestHeaders.Add(header, value);
    }
}
