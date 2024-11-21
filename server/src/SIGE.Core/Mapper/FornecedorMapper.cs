using AutoMapper;
using SIGE.Core.Models.Dto.Default;
using SIGE.Core.Models.Dto.Fornecedor;
using SIGE.Core.Models.Sistema.Fornecedor;

namespace SIGE.Core.Mapper
{
    public class FornecedorMapper : Profile
    {
        public FornecedorMapper()
        {
            CreateMap<FornecedorDto, FornecedorModel>().ReverseMap();
            CreateMap<ContatoDto, ContatoModel > ().ReverseMap();

            CreateMap<FornecedorModel, DropDownDto>()
                .ForMember(dst => dst.Id, map => map.MapFrom(src => src.Id))
                .ForMember(dst => dst.Descricao, map => map.MapFrom(src => src.Nome));
        }
    }
}
