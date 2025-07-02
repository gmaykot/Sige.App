using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SIGE.Core.Enumerators;
using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Geral.RelatorioEconomia;
using SIGE.Core.Models.Sistema.Geral.Economia;
using SIGE.DataAccess.Context;
using SIGE.Services.Interfaces.Gerencial;

namespace SIGE.Services.Services.Gerencial
{
    public class EnergiaAcumuladaService(AppDbContext appDbContext, IMapper mapper) : BaseService<EnergiaAcumuladaDto, EnergiaAcumuladaModel>(appDbContext, mapper), IEnergiaAcumuladaService
    {
        /// <summary>
        /// Inclui o registro no banco de dados, verificando se a vigência não conflita com outros registros existentes.
        /// </summary>
        public override async Task<Response> Incluir(EnergiaAcumuladaDto req)
        {
            if (req.MesReferencia == null)
            {
                return new Response().SetBadRequest()
                    .AddError(ETipoErro.INFORMATIVO, "O mês de referência não pode ser nulo.");
            }

            bool haConflito = await _appDbContext.EnergiasAcumuladas
                .AnyAsync(x =>
                    x.MesReferencia == req.MesReferencia &&
                    x.PontoMedicaoId == req.PontoMedicaoId &&
                    x.Ativo == true
                );

            if (haConflito)
            {
                return new Response().SetBadRequest()
                    .AddError(ETipoErro.INFORMATIVO, "Já existe um registro no mês de referência que se sobrepõe ao período informado.");
            }

            var res = _mapper.Map<EnergiaAcumuladaModel>(req);
            await _appDbContext.AddAsync(res);
            await _appDbContext.SaveChangesAsync();

            return new Response().SetOk()
                .SetData(_mapper.Map<EnergiaAcumuladaDto>(res))
                .SetMessage("Dados cadastrados com sucesso.");
        }

        /// <summary>
        /// Altera o registro no banco de dados, verificando se a vigência não conflita com outros registros existentes.
        /// </summary>
        public override async Task<Response> Alterar(EnergiaAcumuladaDto req)
        {
            if (req.MesReferencia == null)
            {
                return new Response().SetBadRequest()
                    .AddError(ETipoErro.INFORMATIVO, "O mês de referência não pode ser nulo.");
            }

            var entity = await _appDbContext.EnergiasAcumuladas.FindAsync(req.Id);
            if (entity is null)
            {
                return new Response().SetNotFound()
                    .AddError(ETipoErro.INFORMATIVO, $"Registro com Id {req.Id} não encontrado.");
            }

            bool haConflito = await _appDbContext.EnergiasAcumuladas
                .AnyAsync(x =>
                    x.MesReferencia == req.MesReferencia &&
                    x.PontoMedicaoId == req.PontoMedicaoId &&
                    x.Ativo == true
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

        public async Task<Response> ObterPorPontoMedicao(Guid Id)
        {
            var ret = new Response();
            var res = await _appDbContext.EnergiasAcumuladas.Include(e => e.PontoMedicao).Where(b => b.PontoMedicaoId == Id).OrderByDescending(b => b.MesReferencia).ToListAsync();
            if (res != null)
                return ret.SetOk().SetData(_mapper.Map<IEnumerable<EnergiaAcumuladaDto>>(res));

            return ret.SetNotFound()
                .AddError(ETipoErro.INFORMATIVO, $"Não existe registro com o Id {Id}.");
        }

        public async Task<Response> ObterPorMesReferencia(DateTime? MesReferencia)
        {
            var ret = new Response();
            IQueryable<EnergiaAcumuladaModel> query = _appDbContext.EnergiasAcumuladas.Include(e => e.PontoMedicao);

            if (MesReferencia != null)
            {
                query = query.Where(e => e.MesReferencia <= MesReferencia);
            }

            var res = await query.GroupBy(e => e.PontoMedicaoId).Select(g => g.OrderByDescending(e => e.MesReferencia).First()).ToListAsync();

            if (res != null)
                return ret.SetOk().SetData(_mapper.Map<IEnumerable<EnergiaAcumuladaDto>>(res));

            return ret.SetNotFound()
                .AddError(ETipoErro.INFORMATIVO, $"Não existe registro com a referência {MesReferencia}.");
        }
    }
}
