using AutoMapper;
using SIGE.Core.Models.Dto.Geral.RelatorioEconomia;
using SIGE.Core.Models.Sistema.Geral.Economia;

namespace SIGE.Core.Mapper
{
    public class EconomiaMapper : Profile
    {
        public EconomiaMapper()
        {
            CreateMap<EnergiaAcumuladaModel, EnergiaAcumuladaDto>()
                .ForMember(dst => dst.PontoMedicaoDesc, map => map.MapFrom(src => src.PontoMedicao == null ? string.Empty : src.PontoMedicao.Nome))
                .ReverseMap();
        }
    }
}
