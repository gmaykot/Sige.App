using AutoMapper;
using SIGE.Core.Models.Dto.Gerencial.BandeiraTarifaria;
using SIGE.Core.Models.Sistema.Gerencial.BandeiraTarifaria;
using SIGE.DataAccess.Context;

namespace SIGE.Services.Services.Gerencial
{
    public class BandeiraTarifariaService(AppDbContext appDbContext, IMapper mapper) : BaseService<BandeiraTarifariaDto, BandeiraTarifariaModel>(appDbContext, mapper)
    {
    }
}
