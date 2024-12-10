using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using SIGE.Core.Cache;
using SIGE.Core.Enumerators;
using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Administrativo;
using SIGE.Core.Models.Sistema.Administrativo;
using SIGE.Core.Options;
using SIGE.DataAccess.Context;
using SIGE.Services.Interfaces.Administrativo;

namespace SIGE.Services.Services.Administrativo
{
    public class MenuUsuarioService(AppDbContext appDbContext, IMapper mapper, ICacheManager cacheManager, IOptions<CacheOption> cacheOption) : IMenuUsuarioService
    {
        private readonly AppDbContext _appDbContext = appDbContext;
        private readonly IMapper _mapper = mapper;
        private readonly ICacheManager _cacheManager = cacheManager;
        private readonly CacheAuthOption _cacheOption = cacheOption.Value.Auth;

        public async Task<Response> Obter()
        {
            var menus = await _appDbContext.MenusUsuarios.AsNoTracking().Include(m => m.MenuSistema).Where(m => m.Ativo).OrderBy(m => m.MenuSistema.Ordem).ToListAsync();
            var menuUsuarioDto = new List<MenuUsuarioDto>();
            foreach (var menu in menus)
            {
                var menuDto = _mapper.Map<MenuUsuarioDto>(menu);
                menuDto.DescPredecessor = menuUsuarioDto.Find(m => m.Id == menu.MenuSistema.MenuPredecessorId)?.DescPredecessor;
                menuUsuarioDto.Add(menuDto);
            }
            return new Response<IEnumerable<MenuUsuarioDto>>().SetOk().SetData(menuUsuarioDto);
        }

        public async Task<Response> Alterar(MenuUsuarioDto req)
        {
            var empresa = await _appDbContext.MenusUsuarios.FindAsync(req.Id);
            _mapper.Map(req, empresa);
            _ = await _appDbContext.SaveChangesAsync();
            var cacheKey = string.Format(_cacheOption.MenuUsuario.Key, req.UsuarioId);
            await _cacheManager.Remove(cacheKey);

            return new Response().SetOk().SetMessage("Dados do menu alterados com sucesso.");
        }

        public async Task<Response> Excluir(Guid Id)
        {
            var menu = await _appDbContext.MenusUsuarios.FindAsync(Id);
            _appDbContext.MenusUsuarios.Remove(menu);
            _ = await _appDbContext.SaveChangesAsync();
            var cacheKey = string.Format(_cacheOption.MenuUsuario.Key, menu.UsuarioId);
            await _cacheManager.Remove(cacheKey);

            return new Response().SetOk().SetMessage("Menu excluído com sucesso.");
        }

        public async Task<Response> Incluir(MenuUsuarioDto req)
        {
            var menuUsuario = _mapper.Map<MenuUsuarioModel>(req);
            _ = await _appDbContext.AddAsync(menuUsuario);
            _ = await _appDbContext.SaveChangesAsync();
            var cacheKey = string.Format(_cacheOption.MenuUsuario.Key, req.UsuarioId);
            await _cacheManager.Remove(cacheKey);

            return new Response().SetOk().SetMessage("Menu cadastrado com sucesso.");
        }

        public async Task<Response> Obter(Guid Id)
        {
            var ret = new Response();
            var res = await _appDbContext.MenusUsuarios.FindAsync(Id);
            if (res != null)
                return ret.SetOk().SetData(_mapper.Map<MenuUsuarioDto>(res));

            return ret.SetNotFound()
                .AddError(ETipoErro.INFORMATIVO, $"Não existe registro com o Id {Id}.");
        }

        public async Task<Response> ObterPorUsuario(Guid Id)
        {
            var ret = new Response();
            var res = await _appDbContext.MenusUsuarios.Include(m => m.MenuSistema).ThenInclude(m => m.MenuPredecessor)
                .Where(m => m.UsuarioId == Id).OrderBy(m => m.MenuSistema.MenuPredecessor.Ordem).ThenBy(m => m.MenuSistema.Ordem).ToListAsync();
            if (res != null)
                return ret.SetOk().SetData(_mapper.Map<IEnumerable<MenuUsuarioDto>>(res));

            return ret.SetNotFound()
                .AddError(ETipoErro.INFORMATIVO, $"Não existe registro com o Id {Id}.");
        }

        public async Task<Response> IncluirMenus(MenuUsuarioDto[] menusUsuario)
        {
            var ret = new Response();
            if (menusUsuario.Length > 0)
            {
                var res = await _appDbContext.MenusUsuarios.Where(m => m.UsuarioId == menusUsuario.First().UsuarioId).ToListAsync();
                foreach( var menu in menusUsuario)
                {
                    if (res.FirstOrDefault(r => r.MenuSistemaId == menu.MenuSistemaId) == null)
                    {
                        var menuUsuario = _mapper.Map<MenuUsuarioModel>(menu);
                        _ = await _appDbContext.AddAsync(menuUsuario);
                    }
                }
                var cacheKey = string.Format(_cacheOption.MenuUsuario.Key, menusUsuario.First().UsuarioId);
                await _cacheManager.Remove(cacheKey);
                _ = await _appDbContext.SaveChangesAsync();
            }

            return ret.SetNotFound()
                .AddError(ETipoErro.INFORMATIVO, $"Não existe registro a ser incluído.");
        }

        public Task<Response> ObterDropDown()
        {
            throw new NotImplementedException();
        }
    }
}
