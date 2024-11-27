using AutoMapper;
using SIGE.Core.Models.Dto.BandeiraTarifaria;
using SIGE.Core.Models.Dto.Gerencial;
using SIGE.Core.Models.Dto.TarifaAplicacao;
using SIGE.Core.Models.Sistema.BandeiraTarifaria;
using SIGE.Core.Models.Sistema.Gerencial;
using SIGE.Core.Models.Sistema.TarifaAplicacao;

namespace SIGE.Core.Mapper
{
    public class GerencialMapper : Profile
    {
        public GerencialMapper()
        {
            CreateMap<BandeiraTarifariaDto, BandeiraTarifariaModel>().ReverseMap();
            CreateMap<SalarioMinimoDto, SalarioMinimoModel>().ReverseMap();

            CreateMap<TarifaAplicacaoDto, TarifaAplicacaoModel>().ReverseMap();
            CreateMap<TarifaAplicacaoModel, TarifaAplicacaoDto>()
                .ForMember(dst => dst.DescConcessionaria, 
                           map => map.MapFrom(src => src.Concessionaria != null ? src.Concessionaria.Nome : string.Empty));
        }
    }
}
