using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;
using SIGE.Core.Extensions;
using SIGE.Core.Options;

namespace SIGE.Core.Cache
{
    public class CacheManager(IMemoryCache memoryCache, IOptions<CacheOption> option) : ICacheManager
    {
        private readonly IMemoryCache _memoryCache = memoryCache;
        private readonly HashSet<string> _keys = [];
        private readonly CacheOption _option = option.Value;

        // Método para definir um valor no cache com opções personalizáveis
        public async Task Set<T>(string key, T value, int? expiration = null)
        {
            MemoryCacheEntryOptions cacheOptions = new()
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(_option.AbsoluteExpiration),
                SlidingExpiration = TimeSpan.FromMinutes(expiration ?? _option.Expiration),
                Priority = EnumExtensions.GetByIndex<CacheItemPriority>(_option.Priority)
            };
            await Task.Run(() =>
            {
                _memoryCache.Set(key, value, cacheOptions);
                _keys.Add(key);
            });
        }

        // Método para recuperar um valor do cache
        public async Task<T?> Get<T>(string key)
        {
            return await Task.Run(() => _memoryCache.TryGetValue(key, out var value) ? (T?)value : default);
        }

        // Método para remover chaves que contêm uma substring
        public async Task RemoveWhenContains(string subKey)
        {
            await Task.Run(() =>
            {
                var keysToRemove = _keys.Where(key => key.Contains(subKey)).ToList();
                foreach (var key in keysToRemove)
                {
                    _memoryCache.Remove(key);
                    _keys.Remove(key);
                }
            });
        }

        // Método para remover uma chave específica
        public async Task Remove(string key)
        {
            await Task.Run(() =>
            {
                _memoryCache.Remove(key);
                _keys.Remove(key);
            });
        }

        // Método para limpar todo o cache
        public async Task ClearAll()
        {
            await Task.Run(() =>
            {
                foreach (var key in _keys)
                    _memoryCache.Remove(key);
                _keys.Clear();
            });
        }

        // Método para listar todas as chaves do cache
        public async Task<List<string>> ListAllKeys() =>
            await Task.Run(() => _keys.OrderBy(k => k).ToList());
    }
}
