using AutoMapper;
using SIGE.Core.Models.Dto.Administrativo.Ccee;
using SIGE.Core.Models.Dto.Gerencial.Empresa;
using SIGE.Core.Models.Sistema.Geral.Medicao;
using SIGE.Core.Models.Sistema.Gerencial.Empresa;

namespace SIGE.Core.Mapper
{
    public class MedicaoMapper : Profile
    {
        public MedicaoMapper() {
            CreateMap<IntegracaoCceeMedidasDto, MedicoesModel>().ReverseMap()
                .ForMember(dst => dst.Periodo, map => map.MapFrom(src => src.Periodo))
                .ForMember(dst => dst.PontoMedicao, map => map.MapFrom(src => src.ConsumoMensal.PontoMedicao.Codigo))
                .ForMember(dst => dst.DescPontoMedicao, map => map.MapFrom(src => src.ConsumoMensal.PontoMedicao.Nome));
        }
    }
}
