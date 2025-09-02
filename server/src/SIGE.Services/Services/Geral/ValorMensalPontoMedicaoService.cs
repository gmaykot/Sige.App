using AutoMapper;
using SIGE.Core.AppLogger;
using SIGE.Core.Models.Dto.Geral;
using SIGE.Core.Models.Sistema.Geral;
using SIGE.DataAccess.Context;
using SIGE.Services.Interfaces.Geral;

namespace SIGE.Services.Services.Geral {
    public class ValorMensalPontoMedicaoService(AppDbContext appDbContext, IMapper mapper, IAppLogger appLogger) : BaseService<ValorMensalPontoMedicaoDto, ValorMensalPontoMedicaoModel>(appDbContext, mapper, appLogger), IValorMensalPontoMedicaoService {
    }
}
