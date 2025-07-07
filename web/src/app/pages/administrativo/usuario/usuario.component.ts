import { Component, OnInit, Injector } from "@angular/core";
import { LocalDataSource } from "ng2-smart-table";
import { IDropDown } from "../../../@core/data/drop-down";
import { IMenuUsuario } from "../../../@core/data/menu-usuario";
import { IResponseInterface } from "../../../@core/data/response.interface";
import { Classes } from "../../../@core/enum/classes.const";
import { CustomDeleteConfirmationComponent } from "../../../@shared/custom-component/custom-delete-confirmation.component";
import { MenuUsuarioComponent } from "../../../@shared/custom-component/menu-usuario/menu-usuario.component";
import { MenuSistemaService } from "../menu-sistema/menu-sistema.service";
import { MenuUsuarioService } from "./menu-usuario.service";
import { UsuarioConfigSettings } from "./usuario.config.settings";
import { UsuarioService } from "./usuario.service";


@Component({
  selector: 'ngx-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss']
})
export class UsuarioComponent extends UsuarioConfigSettings implements OnInit {  
  public sourceMenu: LocalDataSource = new LocalDataSource();

  constructor(
    protected service: UsuarioService,
    private menuUsuarioService: MenuUsuarioService,
    private menuSistemaService: MenuSistemaService,
    protected injector: Injector
  ) 
  {
    super(injector, service, Classes.USUARIO);
  }

  async onSelectCustom(event) {
    super.onSelect(event);
    this.loadSourceMenu(event.data.id);
  }

  private async loadSourceMenu(id: string) {
    this.loading = true;
    await this.menuUsuarioService
    .getPorUsuario(id)
    .then((response: IResponseInterface<IMenuUsuario[]>) => {
      if (response.success) {
        this.sourceMenu.load(response.data);
      } else {
        this.sourceMenu.load([]);
      }
    });
    this.loading = false;
  }

  async onConfirmMenu() {
    var menus = (await this.menuSistemaService.getDropDownEstruturado()).data;

    var menusGerais: IDropDown[] = [{
      id: '0',
      descricao: 'Principais',
      subGrupo: menus
    }];
    
    menusGerais = menusGerais.concat(menus);
       
    this.dialogService
      .open(MenuUsuarioComponent, { context: { menusSistemaUsuario: menusGerais }})
      .onClose.subscribe(async (response) => {
        if (response) {         
          var menusUsuario: IMenuUsuario[] = [];
          response.menusSistema.forEach(menuSistema => {
            const menu: IMenuUsuario = {
              menuSistemaId: menuSistema.id,
              menuSistemaDesc: menuSistema.desc,
              usuarioId: this.control.value.id,
              tipoPerfil: response.tipoPerfil
            }
            menusUsuario.push(menu);
          });
          if (menusUsuario.length > 0)
          {
            await this.menuUsuarioService
            .postMenus(menusUsuario)
            .then((res2: IResponseInterface<any>) => {
              if (res2.success) {
              }
            });
            this.alertService.showSuccess('Menu atualizado com sucesso.');
            this.loadSourceMenu(this.control.value.id);
          }        
        }
      });
  }

  onDeletMenu(){
    if (this.checked.length > 0){
      this.dialogService
      .open(CustomDeleteConfirmationComponent, { context: { mesage: 'Deseja realmente excluir os registros selecionados?'} })
      .onClose.subscribe(async (excluir) => {
        if (excluir){  
          this.checked.forEach(async menu => {
            await this.menuUsuarioService
            .delete(menu.id)
            .then((res2: IResponseInterface<any>) => {
            });
          });
          this.loadSourceMenu(this.control.value.id);
          this.alertService.showSuccess("Registros excluídos com sucesso.");
          this.checked = [];
        }
      });          
    }
  }
}
