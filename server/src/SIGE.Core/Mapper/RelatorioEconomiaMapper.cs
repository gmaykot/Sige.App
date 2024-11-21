using AutoMapper;
using SIGE.Core.Models.Dto.RelatorioEconomia;
using SIGE.Core.Models.Sistema.RelatorioEconomia;

namespace SIGE.Core.Mapper
{
    public class RelatorioEconomiaMapper : Profile
    {
        public RelatorioEconomiaMapper()
        {
            CreateMap<RelatorioEconomiaModel, RelatorioEconomiaDto> ().ReverseMap();
        }
    }
}
