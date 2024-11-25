using AutoMapper;
using SIGE.Core.Models.Dto.BandeiraTarifaria;
using SIGE.Core.Models.Sistema.BandeiraTarifaria;

namespace SIGE.Core.Mapper
{
    public class GerencialMapper : Profile
    {
        public GerencialMapper()
        {
            CreateMap<BandeiraTarifariaDto, BandeiraTarifariaModel>().ReverseMap();
        }
    }
}
