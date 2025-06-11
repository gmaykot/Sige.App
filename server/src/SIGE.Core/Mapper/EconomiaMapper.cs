using AutoMapper;
using SIGE.Core.Models.Dto.Geral.RelatorioEconomia;
using SIGE.Core.Models.Sistema.Geral.Economia;

namespace SIGE.Core.Mapper
{
    public class EconomiaMapper : Profile
    {
        public EconomiaMapper()
        {
            CreateMap<EnergiaAcumuladaModel, EnergiaAcumuladaDto>().ReverseMap();
        }
    }
}
