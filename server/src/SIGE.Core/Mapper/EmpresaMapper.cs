using AutoMapper;
using SIGE.Core.Models.Dto.Default;
using SIGE.Core.Enumerators;
using SIGE.Core.Extensions;
using SIGE.Core.Models.Dto.Gerencial.Empresa;
using SIGE.Core.Models.Sistema.Gerencial.Empresa;

namespace SIGE.Core.Mapper
{
    public class EmpresaMapper : Profile
    {
        public EmpresaMapper() {
            CreateMap<EmpresaModel, DropDownDto>()
                .ForMember(dst => dst.Id, map => map.MapFrom(src => src.Id))
                .ForMember(dst => dst.Descricao, map => map.MapFrom(src => src.NomeFantasia));

            CreateMap<EmpresaModel, EmpresaDto>()
                .ForMember(dst => dst.Estado, map => map.MapFrom(src => src.Estado.GetSigla()));

            CreateMap<EmpresaDto, EmpresaModel>()
                .ForMember(dst => dst.Estado, map => map.MapFrom(src => Enum.Parse(typeof(ETipoEstado), src.Estado)));

            CreateMap<AgenteMedicaoDto, AgenteMedicaoModel>().ReverseMap();

            CreateMap<PontoMedicaoDto, PontoMedicaoModel>();

            CreateMap<PontoMedicaoModel, PontoMedicaoDto>()
                .ForMember(dst => dst.DescAgenteMedicao,
                    map => map.MapFrom(src => src.AgenteMedicao != null ? src.AgenteMedicao.Nome : string.Empty))
                .ForMember(dst => dst.DescConcessionaria,
                    map => map.MapFrom(src => src.Concessionaria != null ? src.Concessionaria.Nome : string.Empty));

            CreateMap<PontoMedicaoModel, DropDownDto>()
                .ForMember(dst => dst.Id, map => map.MapFrom(src => src.Id))
                .ForMember(dst => dst.Descricao, map => map.MapFrom(src => $"{src.Nome} ({src.Codigo})"));
        }
    }
}
