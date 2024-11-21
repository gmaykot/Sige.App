using AutoMapper;
using SIGE.Core.Models.Dto.Contrato;
using SIGE.Core.Models.Dto.Default;
using SIGE.Core.Models.Sistema.Contrato;

namespace SIGE.Core.Mapper
{
    public class ContratoMapper : Profile
    {
        public ContratoMapper()
        {
            CreateMap<ContratoModel, ContratoDto>().ReverseMap();
            CreateMap<ValorAnualContratoModel, ValorAnualContratoDto>().ReverseMap();
            CreateMap<ValorMensalContratoModel, ValorMensalContratoDto>().ReverseMap();
            CreateMap<ContratoEmpresaModel, ContratoEmpresaDto>().ReverseMap();

            CreateMap<ContratoModel, DropDownDto>()
                .ForMember(dst => dst.Id, map => map.MapFrom(src => src.Id))
                .ForMember(dst => dst.Descricao, map => map.MapFrom(src => src.Numero));

            CreateMap<ContratoModel, ContratoDto>()
                .ForMember(dst => dst.DescFornecedor, map => map.MapFrom(src => src.Fornecedor == null ? string.Empty : src.Fornecedor.Nome))
                .ForMember(dst => dst.DescConcessionaria, map => map.MapFrom(src => src.Concessionaria == null ? string.Empty : src.Concessionaria.Nome));

            CreateMap<ContratoEmpresaModel, ContratoEmpresaDto>()
                .ForMember(dst => dst.DscEmpresa, map => map.MapFrom(src => src.Empresa == null ? string.Empty : src.Empresa.NomeFantasia))
                .ForMember(dst => dst.CnpjEmpresa, map => map.MapFrom(src => src.Empresa == null ? string.Empty : src.Empresa.CNPJ));
        }
    }
}
