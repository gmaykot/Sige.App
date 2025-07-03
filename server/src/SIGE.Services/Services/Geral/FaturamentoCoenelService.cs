using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SIGE.Core.Enumerators;
using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Geral;
using SIGE.Core.Models.Sistema.Geral;
using SIGE.Core.SQLFactory;
using SIGE.DataAccess.Context;
using SIGE.Services.Interfaces.Geral;

namespace SIGE.Services.Services.Geral
{
    public class FaturamentoCoenelService(AppDbContext appDbContext, IMapper mapper) : BaseService<FaturamentoCoenelDto, FaturamentoCoenelModel>(appDbContext, mapper), IFaturamentoCoenelService
    {
        /// <summary>
        /// Inclui o registro no banco de dados, verificando se a vigência não conflita com outros registros existentes.
        /// </summary>
        public override async Task<Response> Incluir(FaturamentoCoenelDto req)
        {
            if (req.VigenciaFinal != null && req.VigenciaFinal < req.VigenciaInicial)
            {
                return new Response().SetBadRequest()
                    .AddError(ETipoErro.INFORMATIVO, "A Vigência Final não pode ser menor que a Vigência Inicial.");
            }

            var novaInicial = req.VigenciaInicial;
            var novaFinal = req.VigenciaFinal ?? DateTime.MaxValue;

            bool haConflito = await _appDbContext.FaturamentosCoenel
                .AnyAsync(x =>
                    novaInicial <= (x.VigenciaFinal ?? DateTime.MaxValue) &&
                    x.VigenciaInicial <= novaFinal &&
                    x.Ativo == true &&
                    x.PontoMedicaoId == req.PontoMedicaoId
                );

            if (haConflito)
            {
                return new Response().SetBadRequest()
                    .AddError(ETipoErro.INFORMATIVO, "Já existe um registro com vigência que se sobrepõe ao período informado.");
            }

            var res = _mapper.Map<FaturamentoCoenelModel>(req);
            await _appDbContext.AddAsync(res);
            await _appDbContext.SaveChangesAsync();

            return new Response().SetOk()
                .SetData(_mapper.Map<FaturamentoCoenelDto>(res))
                .SetMessage("Dados cadastrados com sucesso.");
        }

        /// <summary>
        /// Altera o registro no banco de dados, verificando se a vigência não conflita com outros registros existentes.
        /// </summary>
        public override async Task<Response> Alterar(FaturamentoCoenelDto req)
        {
            if (req.VigenciaFinal != null && req.VigenciaFinal < req.VigenciaInicial)
            {
                return new Response().SetBadRequest()
                    .AddError(ETipoErro.INFORMATIVO, "A Vigência Final não pode ser menor que a Vigência Inicial.");
            }

            var entity = await _appDbContext.FaturamentosCoenel.FindAsync(req.Id);
            if (entity is null)
            {
                return new Response().SetNotFound()
                    .AddError(ETipoErro.INFORMATIVO, $"Registro com Id {req.Id} não encontrado.");
            }

            var novaInicial = req.VigenciaInicial;
            var novaFinal = req.VigenciaFinal ?? DateTime.MaxValue;

            bool haConflito = await _appDbContext.FaturamentosCoenel
                .AnyAsync(x =>
                    x.Id != req.Id &&
                    novaInicial <= (x.VigenciaFinal ?? DateTime.MaxValue) &&
                    x.VigenciaInicial <= novaFinal &&
                    x.Ativo == true &&
                    x.PontoMedicaoId == req.PontoMedicaoId
                );

            if (haConflito)
            {
                return new Response().SetBadRequest()
                    .AddError(ETipoErro.INFORMATIVO, "Já existe um registro com vigência que se sobrepõe ao período informado.");
            }

            // Atualiza os dados
            _mapper.Map(req, entity);

            await _appDbContext.SaveChangesAsync();

            return new Response().SetOk().SetData(req)
                .SetMessage("Registro alterado com sucesso.");
        }

        public override async Task<Response> Obter()
        {
            var ret = new Response();
            var res = await _appDbContext.FaturamentosCoenel.ToListAsync();
            if (res.Count > 0)
                return ret.SetOk().SetData(_mapper.Map<IEnumerable<FaturamentoCoenelDto>>(res).OrderByDescending(f => f.VigenciaInicial));

            return ret.SetNotFound()
                .AddError(ETipoErro.INFORMATIVO, $"Não existem registros cadastrados.");
        }

        public async Task<Response> ObterPorPontoMedicao(Guid Id)
        {
            var ret = new Response();
            var res = await _appDbContext.FaturamentosCoenel.Include(f => f.PontoMedicao).ThenInclude(p => p.AgenteMedicao).ThenInclude(a => a.Empresa).Where(f => f.PontoMedicaoId.Equals(Id)).ToListAsync();
            if (res != null)
                return ret.SetOk().SetData(_mapper.Map<IEnumerable<FaturamentoCoenelDto>>(res).OrderBy(f => f.DescEmpresa).ThenBy(f => f.DescPontoMedicao).ThenByDescending(f => f.VigenciaFinal));

            return ret.SetNotFound()
                .AddError(ETipoErro.INFORMATIVO, $"Não existe registro com o ponto de medição {Id}.");
        }

        public override async Task<Response> ObterSource()
        {
            var ret = new Response();
            var res = await _appDbContext.Database.SqlQueryRaw<FaturamentoCoenelDto>(FaturamentoFactory.ObterSource()).ToListAsync();
            if (res != null)
                return ret.SetOk().SetData(_mapper.Map<IEnumerable<FaturamentoCoenelDto>>(res).OrderBy(f => f.DescEmpresa).ThenBy(f => f.DescPontoMedicao).ThenByDescending(f => f.VigenciaFinal));

            return ret.SetNotFound()
                .AddError(ETipoErro.INFORMATIVO, $"Não existem registros cadastrados.");
        }
    }
}
