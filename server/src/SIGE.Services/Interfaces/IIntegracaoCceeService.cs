using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Ccee;

namespace SIGE.Services.Interfaces
{
    public interface IIntegracaoCceeService
    {
        public Task<Response> ListarMedicoes(IntegracaoCceeBaseDto req);
        public Task<Response> ListarMedicoesPorPonto(IntegracaoCceeBaseDto req);
    }
}
