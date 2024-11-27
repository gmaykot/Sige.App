using AutoMapper;
using SIGE.Core.Models.Dto.Administrativo.Ccee;

namespace SIGE.Core.Mapper
{
    public class CceeMapper : Profile
    {
        public CceeMapper()
        {
            CreateMap<IntegracaoCceeXmlDto, IntegracaoCceeDto>().ReverseMap();
            CreateMap<IntegracaoCceeMedidaXMlsDto, IntegracaoCceeMedidasDto>().ReverseMap();
        }
    }
}
