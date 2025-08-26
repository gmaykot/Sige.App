using AutoMapper;
using SIGE.Core.Models.Dto.Geral.FaturaEnergia;
using SIGE.Core.Models.Sistema.Geral.FaturaEnergia;

namespace SIGE.Core.Mapper
{
    public class FaturaEnergiaMapper : Profile
    {
        public FaturaEnergiaMapper()
        {
            CreateMap<FaturaEnergiaModel, FaturaEnergiaDto>()
                .ForMember(dst => dst.PontoMedicaoDesc, map => map.MapFrom(src => src.PontoMedicao == null ? string.Empty : src.PontoMedicao.Nome))
                .ForMember(dst => dst.ConcessionariaDesc, map => map.MapFrom(src => src.Concessionaria == null ? string.Empty : src.Concessionaria.Nome))
                .ReverseMap();

            CreateMap<LancamentoAdicionalModel, LancamentoAdicionalDto>().ReverseMap();
        }
    }
}