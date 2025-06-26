using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Gerencial.BandeiraTarifaria;
using SIGE.Core.Models.Dto.GerenciamentoMensal;

namespace SIGE.Services.Interfaces
{
    public interface IGerenciamentoMensalService
    {
        Task<Response> IncluirBandeiraVigente(BandeiraTarifariaVigenteDto req);
        Task<Response> IncluirPisCofins(PisCofinsMensalDto req);
        Task<Response> IncluirProinfaIcms(ProinfaIcmsMensalDto req);
        Task<Response> ObterDadodsMensais(DateTime mesReferencia);
    }
}
