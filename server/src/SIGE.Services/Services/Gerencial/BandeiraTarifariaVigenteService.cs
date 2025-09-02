using AutoMapper;
using SIGE.Core.AppLogger;
using SIGE.Core.Models.Dto.Gerencial.BandeiraTarifaria;
using SIGE.Core.Models.Sistema.Gerencial.BandeiraTarifaria;
using SIGE.DataAccess.Context;

namespace SIGE.Services.Services.Gerencial {
    public class BandeiraTarifariaVigenteService(AppDbContext appDbContext, IMapper mapper, IAppLogger appLogger) : BaseService<BandeiraTarifariaVigenteDto, BandeiraTarifariaVigenteModel>(appDbContext, mapper, appLogger) {
    }
}
