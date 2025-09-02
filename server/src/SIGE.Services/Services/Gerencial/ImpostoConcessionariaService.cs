using AutoMapper;
using SIGE.Core.AppLogger;
using SIGE.Core.Models.Dto.Gerencial.Concessionaria;
using SIGE.Core.Models.Sistema.Gerencial.Concessionaria;
using SIGE.DataAccess.Context;

namespace SIGE.Services.Services.Gerencial {
    public class ImpostoConcessionariaService(AppDbContext appDbContext, IMapper mapper, IAppLogger appLogger) : BaseService<ImpostoConcessionariaDto, ImpostoConcessionariaModel>(appDbContext, mapper, appLogger) { }
}
