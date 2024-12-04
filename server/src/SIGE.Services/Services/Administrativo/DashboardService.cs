using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Newtonsoft.Json;
using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Administrativo.Dashboard;
using SIGE.Core.Models.Dto.Default;
using SIGE.Core.SQLFactory;
using SIGE.DataAccess.Context;
using SIGE.Services.Interfaces.Administrativo;

namespace SIGE.Services.Services.Administrativo
{
    public class DashboardService(AppDbContext appDbContext, IMemoryCache memoryCache) : IDashboardService
    {
        private readonly AppDbContext _appDbContext = appDbContext;
        private readonly IMemoryCache _memoryCache = memoryCache;
        private readonly MemoryCacheEntryOptions _cacheEntryOptions = new()
        {
            AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10),
            SlidingExpiration = TimeSpan.FromMinutes(2),
            Priority = CacheItemPriority.Normal
        };

        public async Task<Response> ObterChecklist(DateTime mesReferencia)
        {            
            var ret = new Response();
            var checklist = new List<ChecklistDashboardDto>();
            var cacheKey = $"ObterChecklist{mesReferencia:ddMMyyyy}";

            if (_memoryCache.TryGetValue(cacheKey, out string valor))
                return ret.SetOk().SetData(JsonConvert.DeserializeObject<List<ChecklistDashboardDto>>(valor));

            var res = await _appDbContext.Database.SqlQueryRaw<SqlFactoryDto>(DashboardFactory.ColetaMedicoes(mesReferencia)).FirstOrDefaultAsync();
            if (res != null)
            {
                checklist.Add(new() { Motivo = "Coletar de medições de 11/2024", Finalizado = res.Total > 0, Link = "pages/medicao" });
            };

            res = await _appDbContext.Database.SqlQueryRaw<SqlFactoryDto>(DashboardFactory.FaturamentoCoenel(mesReferencia)).FirstOrDefaultAsync();
            if (res != null)
            {
                checklist.Add(new() { Motivo = "Cadastrar Faturamento Coenel de 11/2024", Finalizado = res.Total > 0, Link = "pages/faturamento-coenel" });
            };

            res = await _appDbContext.Database.SqlQueryRaw<SqlFactoryDto>(DashboardFactory.BandeirasVigentes(mesReferencia)).FirstOrDefaultAsync();
            if (res != null)
            {
                checklist.Add(new() { Motivo = "Cadastrar Bandeira Tarifária Vigente de 11/2024", Finalizado = res.Total > 0, Link = "pages/bandeira-tarifaria" });
            };

            _memoryCache.Set(cacheKey, JsonConvert.SerializeObject(checklist), _cacheEntryOptions);

            return ret.SetOk().SetData(checklist);
        }

        public async Task<Response> ObterConsumoMeses(DateTime mesReferencia, int meses)
        {
            var ret = new Response();
            var cacheKey = $"ObterConsumoMeses{mesReferencia:ddMMyyyy}";

            if (_memoryCache.TryGetValue(cacheKey, out string valor))
                return ret.SetOk().SetData(JsonConvert.DeserializeObject<List<ConsumoMensalDashboardDto>>(valor));

            var res = await _appDbContext.Database.SqlQueryRaw<ConsumoMensalDashboardDto>(DashboardFactory.ConsumoMeses(mesReferencia, meses)).ToListAsync();
            if (res != null)
            {
                _memoryCache.Set(cacheKey, JsonConvert.SerializeObject(res), _cacheEntryOptions);
                return ret.SetOk().SetData(res);
            };

            return ret.SetNotFound();
        }

        public async Task<Response> ObterContratosFinalizados(DateTime mesReferencia)
        {
            var ret = new Response();
            var cacheKey = $"ObterContratosFinalizados{mesReferencia:ddMMyyyy}";

            if (_memoryCache.TryGetValue(cacheKey, out string valor))
                return ret.SetOk().SetData(JsonConvert.DeserializeObject<List<ContratoFinalizadoDashboardDto>>(valor));

            var res = await _appDbContext.Database.SqlQueryRaw<ContratoFinalizadoDashboardDto>(DashboardFactory.ContratosFimVigencia(mesReferencia)).ToListAsync();
            if (res != null && res.Count != 0)
            {
                _memoryCache.Set(cacheKey, JsonConvert.SerializeObject(res), _cacheEntryOptions);
                return ret.SetOk().SetData(res);
            };

            return ret.SetNotFound();
        }

        public async Task<Response> ObterStatusMedicoes(DateTime mesReferencia)
        {
            var ret = new Response();
            var cacheKey = $"ObterStatusMedicoes{mesReferencia:ddMMyyyy}";

            if (_memoryCache.TryGetValue(cacheKey, out string valor))
                return ret.SetOk().SetData(JsonConvert.DeserializeObject<List<StatusMedicaoDashboardDto>>(valor));

            var res = await _appDbContext.Database.SqlQueryRaw<StatusMedicaoDashboardDto>(DashboardFactory.ColetaMedicoes(mesReferencia, true)).ToListAsync();
            if (res != null)
            {
                _memoryCache.Set(cacheKey, JsonConvert.SerializeObject(res), _cacheEntryOptions);
                return ret.SetOk().SetData(res);
            };            
            return ret.SetNotFound();
        }
    }
}
