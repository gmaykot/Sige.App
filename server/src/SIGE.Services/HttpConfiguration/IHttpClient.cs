namespace SIGE.Services.HttpConfiguration
{
    public interface IHttpClient<T>
    {
        Task<HttpResponseMessage> SendAsync(HttpRequestMessage req);
        Task<HttpResponseMessage> PostAsync(string requestUri, HttpContent content);
        void AddHeader(string header, string value);
    }
}
