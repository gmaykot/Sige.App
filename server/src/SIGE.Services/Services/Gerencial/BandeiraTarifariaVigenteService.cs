using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SIGE.Core.Enumerators;
using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Gerencial.BandeiraTarifaria;
using SIGE.Core.Models.Sistema.Gerencial.BandeiraTarifaria;
using SIGE.DataAccess.Context;
using SIGE.Services.Interfaces.Gerencial;

namespace SIGE.Services.Services.Gerencial
{
    public class BandeiraTarifariaVigenteService(AppDbContext appDbContext, IMapper mapper) : BaseService<BandeiraTarifariaVigenteDto, BandeiraTarifariaVigenteModel>(appDbContext, mapper), IBandeiraTarifariaVigenteService
    {
        public async Task<Response> ObterPorBandeira(Guid Id)
        {            
            var ret = new Response();
            var res = await _appDbContext.Set<BandeiraTarifariaVigenteModel>().Where(b => b.BandeiraTarifariaId == Id).OrderByDescending(b => b.MesReferencia).ToListAsync();
            if (res != null)
                return ret.SetOk().SetData(_mapper.Map<IEnumerable<BandeiraTarifariaVigenteDto>>(res));

            return ret.SetNotFound()
                .AddError(ETipoErro.INFORMATIVO, $"Não existe registro com o Id {Id}.");
        }
    }
}
