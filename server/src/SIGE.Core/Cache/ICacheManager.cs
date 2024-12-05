using Microsoft.Extensions.Caching.Memory;

namespace SIGE.Core.Cache
{
    public interface ICacheManager
    {
        public Task Set<T>(string key, T value, MemoryCacheEntryOptions? options = null);
        public Task<T?> Get<T>(string key);
        public Task Remove(string key);
        public Task RemoveWhenContains(string subKey);
        public Task ClearAll();
        public Task<List<string>> ListAllKeys();
    }
}
