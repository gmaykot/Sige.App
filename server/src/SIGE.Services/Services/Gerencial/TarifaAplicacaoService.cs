using AutoMapper;
using MySqlConnector;
using SIGE.Core.AppLogger;
using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Gerencial;
using SIGE.Core.Models.Dto.Source;
using SIGE.Core.Models.Sistema.Gerencial;
using SIGE.Core.SQLFactory;
using SIGE.DataAccess.Context;

namespace SIGE.Services.Services.Gerencial {
    public class TarifaAplicacaoService(AppDbContext appDbContext, IMapper mapper, IAppLogger appLogger) : BaseService<TarifaAplicacaoDto, TarifaAplicacaoModel>(appDbContext, mapper, appLogger) {
        public override async Task<Response> ObterSource() {
            return await ExecutarSource<TarifaAplicacaoSourceDto>(SourceFactory.TarifasAplicacao());
        }

        public override async Task<Response> Load(Guid id) {
            var parameters = new MySqlParameter[]
            {
                new("@Id", MySqlDbType.Guid) { Value = id },
            };
            return await ExecutarSource<TarifaAplicacaoDto>(CarregarFactory.TarifasAplicacao(), parameters);
        }
    }
}
