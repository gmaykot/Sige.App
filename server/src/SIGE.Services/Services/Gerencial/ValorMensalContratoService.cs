using AutoMapper;
using SIGE.Core.Models.Dto.Gerencial.Contrato;
using SIGE.Core.Models.Sistema.Gerencial.Contrato;
using SIGE.DataAccess.Context;

namespace SIGE.Services.Services.Gerencial
{
    public class ValorMensalContratoService(AppDbContext appDbContext, IMapper mapper) : BaseService<ValorMensalContratoDto, ValorMensalContratoModel>(appDbContext, mapper) { }
}
