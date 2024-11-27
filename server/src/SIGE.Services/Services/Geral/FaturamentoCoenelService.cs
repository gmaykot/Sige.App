using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.FaturmentoCoenel;
using SIGE.Services.Interfaces;

namespace SIGE.Services.Services.Geral
{
    public class FaturamentoCoenelService : IBaseInterface<FaturmentoCoenelDto>
    {
        public Task<Response> Alterar(FaturmentoCoenelDto req)
        {
            throw new NotImplementedException();
        }

        public Task<Response> Excluir(Guid Id)
        {
            throw new NotImplementedException();
        }

        public Task<Response> Incluir(FaturmentoCoenelDto req)
        {
            throw new NotImplementedException();
        }

        public Task<Response> Obter(Guid Id)
        {
            throw new NotImplementedException();
        }

        public async Task<Response> Obter()
        {
            var ret = new Response();
            return ret.SetOk().SetData(Array.Empty<FaturmentoCoenelDto>());
        }

        public Task<Response> ObterDropDown()
        {
            throw new NotImplementedException();
        }
    }
}
