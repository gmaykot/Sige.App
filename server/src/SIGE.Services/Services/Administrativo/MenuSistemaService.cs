using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SIGE.Core.Enumerators;
using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Administrativo;
using SIGE.Core.Models.Dto.Default;
using SIGE.Core.Models.Sistema.Administrativo;
using SIGE.DataAccess.Context;
using SIGE.Services.Interfaces.Administrativo;

namespace SIGE.Services.Services.Administrativo
{
    public class MenuSistemaService(AppDbContext appDbContext, IMapper mapper) : BaseService<MenuSistemaDto, MenuSistemaModel>(appDbContext, mapper), IMenuSistemaService
    {
        private readonly AppDbContext _appDbContext = appDbContext;
        private readonly IMapper _mapper = mapper;

        public async Task<Response> ObterDropDown()
        {
            var ret = new Response();
            var res = await _appDbContext.MenusSistema.Where(m => m.Ativo).ToListAsync();
            if (res.Count > 0)
                return ret.SetOk().SetData(_mapper.Map<IEnumerable<DropDownDto>>(res));

            return ret.SetNotFound().AddError(ETipoErro.INFORMATIVO, "Não existe menu cadastrado.");
        }

        public async Task<Response> ObterDropDownEstruturado()
        {
            var ret = new Response();
            var res = await _appDbContext.MenusSistema.Where(m => m.Ativo).ToListAsync();
            if (res.Count > 0)
            {
                var menus = _mapper.Map<IEnumerable<DropDownDto>>(res.Where(m => m.MenuPredecessorId == null).OrderBy(m => m.Ordem));
                foreach (var menu in menus)
                {
                    menu.SubGrupo = _mapper.Map<IEnumerable<DropDownDto>>(res.Where(m => m.MenuPredecessorId == menu.Id).OrderBy(m => m.Ordem));
                }

                return ret.SetOk().SetData(menus);
            }

            return ret.SetNotFound().AddError(ETipoErro.INFORMATIVO, "Não existe menu cadastrado.");
        }

        public async Task<Response> ObterEstruturtado()
        {
            var ret = new Response<IEnumerable<MenuSistemaDto>>();

            var menusSistema = await _appDbContext.MenusSistema.AsNoTracking().Where(m => m.Ativo).OrderBy(m => m.Ordem).ToListAsync();

            var menuSistemaDto = new List<MenuSistemaDto>();

            foreach (var menu in menusSistema)
            {
                if (menu.MenuPredecessorId != null)
                {
                    var menuUsu = menuSistemaDto.Find(m => m.Id == menu.MenuPredecessorId);
                    menuUsu ??= menuSistemaDto.Where(m => m.children != null).SelectMany(m => m.children).ToList().Find(m => m.Id == menu.MenuPredecessorId);

                    if (menuUsu != null)
                    {
                        menuUsu.children ??= new List<MenuSistemaDto>();
                        menuUsu.children.Add(_mapper.Map<MenuSistemaDto>(menu));
                    }
                }
                else
                    menuSistemaDto.Add(_mapper.Map<MenuSistemaDto>(menu));
            }

            return ret.SetOk().SetData(menuSistemaDto);
        }

        public async Task<Response> Obter()
        {
            var menus = await _appDbContext.MenusSistema.AsNoTracking().OrderBy(m => m.Ordem).ToListAsync();
            var menuSistemaDto = new List<MenuSistemaDto>();
            foreach (var menu in menus)
            {
                var menuDto = _mapper.Map<MenuSistemaDto>(menu);
                menuDto.DescPredecessor = menuSistemaDto.Find(m => m.Id == menu.MenuPredecessorId)?.title;
                menuSistemaDto.Add(menuDto);
            }
            return new Response<IEnumerable<MenuSistemaDto>>().SetOk().SetData(menuSistemaDto);
        }


        public async Task<Response> Alterar(MenuSistemaDto req)
        {
            var empresa = await _appDbContext.MenusSistema.FindAsync(req.Id);
            _mapper.Map(req, empresa);
            _ = await _appDbContext.SaveChangesAsync();

            return new Response().SetOk().SetMessage("Dados do menu alterados com sucesso.");
        }

        public async Task<Response> Excluir(Guid Id)
        {
            var empresa = await _appDbContext.MenusSistema.FindAsync(Id);
            _appDbContext.MenusSistema.Remove(empresa);
            _ = await _appDbContext.SaveChangesAsync();

            return new Response().SetOk().SetMessage("Menu excluído com sucesso.");
        }

        public async Task<Response> Incluir(MenuSistemaDto req)
        {
            var res = _mapper.Map<MenuSistemaModel>(req);
            _ = await _appDbContext.AddAsync(res);
            _ = await _appDbContext.SaveChangesAsync();

            return new Response().SetOk().SetData(_mapper.Map<MenuSistemaDto>(res)).SetMessage("Menu cadastrado com sucesso.");
        }

        public Task<Response> Obter(Guid Id)
        {
            throw new NotImplementedException();
        }

        public Task<Response> ObterSource()
        {
            throw new NotImplementedException();
        }
    }
}
