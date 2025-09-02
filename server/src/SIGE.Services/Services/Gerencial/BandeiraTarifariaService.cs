using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SIGE.Core.AppLogger;
using SIGE.Core.Enumerators;
using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Gerencial.BandeiraTarifaria;
using SIGE.Core.Models.Sistema.Gerencial.BandeiraTarifaria;
using SIGE.DataAccess.Context;

namespace SIGE.Services.Services.Gerencial {
    public class BandeiraTarifariaService(AppDbContext appDbContext, IMapper mapper, IAppLogger appLogger) : BaseService<BandeiraTarifariaDto, BandeiraTarifariaModel>(appDbContext, mapper, appLogger) {
        /// <summary>
        /// Inclui o registro no banco de dados, verificando se a vigência não conflita com outros registros existentes.
        /// </summary>
        public override async Task<Response> Incluir(BandeiraTarifariaDto req) {
            if (req.VigenciaFinal != null && req.VigenciaFinal < req.VigenciaInicial) {
                return new Response().SetBadRequest()
                    .AddError(ETipoErro.INFORMATIVO, "A Vigência Final não pode ser menor que a Vigência Inicial.");
            }

            var novaInicial = req.VigenciaInicial;
            var novaFinal = req.VigenciaFinal ?? DateTime.MaxValue;

            bool haConflito = await _appDbContext.BandeirasTarifarias
                .AnyAsync(x =>
                    novaInicial <= (x.VigenciaFinal ?? DateTime.MaxValue) &&
                    x.VigenciaInicial <= novaFinal &&
                    x.Ativo == true
                );

            if (haConflito) {
                return new Response().SetBadRequest()
                    .AddError(ETipoErro.INFORMATIVO, "Já existe um registro com vigência que se sobrepõe ao período informado.");
            }

            var res = _mapper.Map<BandeiraTarifariaModel>(req);
            await _appDbContext.AddAsync(res);
            await _appDbContext.SaveChangesAsync();

            return new Response().SetOk()
                .SetData(_mapper.Map<BandeiraTarifariaModel>(res))
                .SetMessage("Dados cadastrados com sucesso.");
        }

        /// <summary>
        /// Altera o registro no banco de dados, verificando se a vigência não conflita com outros registros existentes.
        /// </summary>
        public override async Task<Response> Alterar(BandeiraTarifariaDto req) {
            if (req.VigenciaFinal != null && req.VigenciaFinal < req.VigenciaInicial) {
                return new Response().SetBadRequest()
                    .AddError(ETipoErro.INFORMATIVO, "A Vigência Final não pode ser menor que a Vigência Inicial.");
            }

            var entity = await _appDbContext.BandeirasTarifarias.FindAsync(req.Id);
            if (entity is null) {
                return new Response().SetNotFound()
                    .AddError(ETipoErro.INFORMATIVO, $"Registro com Id {req.Id} não encontrado.");
            }

            var novaInicial = req.VigenciaInicial;
            var novaFinal = req.VigenciaFinal ?? DateTime.MaxValue;

            bool haConflito = await _appDbContext.BandeirasTarifarias
                .AnyAsync(x =>
                    x.Id != req.Id &&
                    novaInicial <= (x.VigenciaFinal ?? DateTime.MaxValue) &&
                    x.VigenciaInicial <= novaFinal &&
                    x.Ativo == true
                );

            if (haConflito) {
                return new Response().SetBadRequest()
                    .AddError(ETipoErro.INFORMATIVO, "Já existe um registro com vigência que se sobrepõe ao período informado.");
            }

            // Atualiza os dados
            _mapper.Map(req, entity);

            await _appDbContext.SaveChangesAsync();

            return new Response().SetOk().SetData(req)
                .SetMessage("Registro alterado com sucesso.");
        }
    }
}
