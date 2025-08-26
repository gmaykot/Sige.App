using AutoMapper;
using SIGE.Core.Models.Dto.Geral;
using SIGE.Core.Models.Sistema.Geral;
using SIGE.DataAccess.Context;
using SIGE.Services.Interfaces.Geral;

namespace SIGE.Services.Services.Geral
{
    public class ValorMensalPontoMedicaoService(AppDbContext appDbContext, IMapper mapper) : BaseService<ValorMensalPontoMedicaoDto, ValorMensalPontoMedicaoModel>(appDbContext, mapper), IValorMensalPontoMedicaoService
    {
    }
}
