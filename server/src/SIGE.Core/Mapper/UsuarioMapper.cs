using AutoMapper;
using SIGE.Core.Models.Dto.Administrativo;
using SIGE.Core.Models.Dto.Administrativo.Usuario;
using SIGE.Core.Models.Dto.Default;
using SIGE.Core.Models.Sistema.Administrativo;

namespace SIGE.Core.Mapper
{
    public class UsuarioMapper : Profile
    {
        public UsuarioMapper()
        {
            CreateMap<UsuarioDto, UsuarioModel>().ReverseMap();
            CreateMap<UsuarioDto, DropDownDto>()
                .ForMember(dst => dst.Id, map => map.MapFrom(src => src.Id))
                .ForMember(dst => dst.Descricao, map => map.MapFrom(src => src.Nome));

            CreateMap<MenuUsuarioDto, MenuUsuarioModel>();
            CreateMap<MenuUsuarioModel, MenuUsuarioDto>()
                .ForMember(dst => dst.DescMenu, map => map.MapFrom(src => src.MenuSistema == null ? "" : src.MenuSistema.Titulo))
                .ForMember(dst => dst.MenuAtivo, map => map.MapFrom(src => src.MenuSistema == null ? false : src.MenuSistema.Ativo))
                .ForMember(dst => dst.DescPredecessor, map => map.MapFrom(src => src.MenuSistema == null || src.MenuSistema.MenuPredecessor == null ? "" : src.MenuSistema.MenuPredecessor.Titulo));
        }
    }
}
