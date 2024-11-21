using AutoMapper;
using SIGE.Core.Models.Dto.Ccee;
using SIGE.Core.Models.Dto.Empresa;
using SIGE.Core.Models.Sistema.Medicao;

namespace SIGE.Core.Mapper
{
    public class MedicaoMapper : Profile
    {
        public MedicaoMapper() {
            CreateMap<AgenteMedicaoDto, AgenteMedicaoModel>().ReverseMap();
            CreateMap<PontoMedicaoDto, PontoMedicaoModel>().ReverseMap();

            CreateMap<IntegracaoCceeMedidasDto, MedicoesModel>().ReverseMap()
                .ForMember(dst => dst.Periodo, map => map.MapFrom(src => src.Periodo))
                .ForMember(dst => dst.PontoMedicao, map => map.MapFrom(src => src.ConsumoMensal.PontoMedicao.Codigo))
                .ForMember(dst => dst.DescPontoMedicao, map => map.MapFrom(src => src.ConsumoMensal.PontoMedicao.Nome));
        }
    }
}
