using AutoMapper;
using SIGE.Core.Enumerators;
using SIGE.Core.Extensions;
using SIGE.Core.Models.Dto.Default;
using SIGE.Core.Models.Dto.Gerencial.Concessionaria;
using SIGE.Core.Models.Sistema.Gerencial.Concessionaria;

namespace SIGE.Core.Mapper
{
    public class ConcessionariaMapper : Profile
    {
        public ConcessionariaMapper()
        {
            CreateMap<ConcessionariaDto, ConcessionariaModel>();

            CreateMap<ConcessionariaModel, DropDownDto>()
                .ForMember(dst => dst.Id, map => map.MapFrom(src => src.Id))
                .ForMember(dst => dst.Descricao, map => map.MapFrom(src => src.Nome));

            CreateMap<ConcessionariaModel, ConcessionariaDto>()
                .ForMember(dst => dst.Estado, map => map.MapFrom(src => src.Estado.GetSigla()));

            CreateMap<ConcessionariaDto, ConcessionariaModel>()
                .ForMember(dst => dst.Estado, map => map.MapFrom(src => Enum.Parse(typeof(ETipoEstado), src.Estado)));

            CreateMap<ValorConcessionariaDto, ValorConcessionariaModel>();

            CreateMap<ValorConcessionariaModel, ValorConcessionariaDto>()
                .ForMember(dst => dst.DescConcessionaria, map => map.MapFrom(src => src.Concessionaria.Nome));

            CreateMap<ValorConcessionariaModel, CalculoValoresConcessionariaDto>()
                .ForMember(dst => dst.DescConcessionaria, map => map.MapFrom(src => src.Concessionaria.Nome));

            CreateMap<ImpostoConcessionariaDto, ImpostoConcessionariaModel>().ReverseMap();
        }
    }
}