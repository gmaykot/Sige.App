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
            CreateMap<MenuUsuarioDto, MenuUsuarioModel>().ReverseMap();

            CreateMap<UsuarioDto, DropDownDto>()
                .ForMember(dst => dst.Id, map => map.MapFrom(src => src.Id))
                .ForMember(dst => dst.Descricao, map => map.MapFrom(src => src.Nome));
        }
    }
}
