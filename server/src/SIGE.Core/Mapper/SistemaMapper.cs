using AutoMapper;
using SIGE.Core.Models.Dto.Geral;
using SIGE.Core.Models.Dto.TarifaAplicacao;
using SIGE.Core.Models.Sistema.Geral;
using SIGE.Core.Models.Sistema.TarifaAplicacao;

namespace SIGE.Core.Mapper
{
    public class SistemaMapper : Profile
    {
        public SistemaMapper()
        {
            CreateMap<ValorPadraoDto, ValorPadraoModel>().ReverseMap();
            CreateMap<TarifaAplicacaoDto, TarifaAplicacaoModel>().ReverseMap()
                .ForMember(dst => dst.DescConcessionaria, map => map.MapFrom(src => src.Concessionaria.Nome));
        }
    }
}
