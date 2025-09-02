using AutoMapper;
using SIGE.Core.AppLogger;
using SIGE.Core.Models.Dto.Gerencial;
using SIGE.Core.Models.Sistema.Gerencial;
using SIGE.DataAccess.Context;

namespace SIGE.Services.Services.Gerencial {
    public class ContatoService(AppDbContext appDbContext, IMapper mapper, IAppLogger appLogger) : BaseService<ContatoDto, ContatoModel>(appDbContext, mapper, appLogger) { }
}
