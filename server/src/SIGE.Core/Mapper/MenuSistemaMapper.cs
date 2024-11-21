using AutoMapper;
using SIGE.Core.Models.Dto.Default;
using SIGE.Core.Models.Dto.Menus;
using SIGE.Core.Models.Sistema.Menus;

namespace SIGE.Core.Mapper
{
    public class MenuSistemaMapper : Profile
    {
        public MenuSistemaMapper()
        {
            CreateMap<MenuSistemaModel, MenuSistemaDto>()
                .ForMember(dst => dst.title, map => map.MapFrom(src => src.Titulo))
                .ForMember(dst => dst.expanded, map => map.MapFrom(src => src.Expandido))
                .ForMember(dst => dst.icon, map => map.MapFrom(src => src.Icone))
                .ForMember(dst => dst.ordem, map => map.MapFrom(src => src.Ordem))
                .ForMember(dst => dst.children, map => map.Ignore());

            CreateMap<MenuSistemaDto, MenuSistemaModel>()
                .ForMember(dst => dst.Titulo, map => map.MapFrom(src => src.title))
                .ForMember(dst => dst.Icone, map => map.MapFrom(src => src.icon))
                .ForMember(dst => dst.Expandido, map => map.MapFrom(src => src.expanded));

            CreateMap<MenuSistemaModel, DropDownDto>()
                .ForMember(dst => dst.Id, map => map.MapFrom(src => src.Id))
                .ForMember(dst => dst.Descricao, map => map.MapFrom(src => src.Titulo));
        }
    }
}
