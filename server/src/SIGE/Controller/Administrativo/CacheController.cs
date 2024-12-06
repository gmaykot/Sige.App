using Microsoft.AspNetCore.Mvc;
using SIGE.Core.Cache;
using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Default;
using Swashbuckle.AspNetCore.Annotations;

namespace SIGE.Controller.Administrativo
{
    [ApiController]
    [Route("cache")]
    public class CacheController(ICacheManager cacheManager) : ControllerBase
    {
        private readonly ICacheManager _cacheManager = cacheManager;

        [HttpPost("clear")]
        [SwaggerOperation(Description = "Efetua a limpeza do cache no sistema.")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> ClearCache([FromBody] DropDownDto? req)
        {
            if (req == null)
                await _cacheManager.ClearAll();
            else
                await _cacheManager.Remove(req.Descricao);

            return Ok();
        }

        [HttpGet("list-all")]
        [SwaggerOperation(Description = "Obtém as chaves do cache no sistema.")]
        [ProducesResponseType(typeof(Response), 200)]
        [ProducesResponseType(typeof(Response), 400)]
        [ProducesResponseType(typeof(Response), 401)]
        [ProducesResponseType(typeof(Response), 500)]
        public async Task<IActionResult> ListAllKeys()
        {
            return Ok(await _cacheManager.ListAllKeys());
        }
    }
}
