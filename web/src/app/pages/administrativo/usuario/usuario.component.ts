import { Component, OnInit } from '@angular/core';
import { AlertService } from '../../../@core/services/util/alert.service';
import { LocalDataSource } from 'ng2-smart-table';
import { UsuarioConfigSettings } from './usuario.config.settings';
import { UsuarioService } from '../../../@core/services/administrativo/usuario.service';
import { NbDialogService, NbLayoutScrollService } from '@nebular/theme';
import { CustomDeleteConfirmationComponent } from '../../../@shared/custom-component/custom-delete-confirmation.component';
import { Classes } from '../../../@core/enum/classes.const';
import { FormBuilderService } from '../../../@core/services/util/form-builder.service';
import { MenuUsuarioComponent } from '../../../@shared/custom-component/menu-usuario/menu-usuario.component';
import { IMenuUsuario } from '../../../@core/data/menu-usuario';
import { MenuUsuarioService } from '../../../@core/services/administrativo/menu-usuario.service';
import { IResponseInterface } from '../../../@core/data/response.interface';
import { MenuSistemaService } from '../../../@core/services/administrativo/menu-sistema.service';
import { IDropDown } from '../../../@core/data/drop-down';

@Component({
  selector: 'ngx-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss']
})
export class UsuarioComponent extends UsuarioConfigSettings implements OnInit {  
  public sourceMenu: LocalDataSource = new LocalDataSource();

  constructor(
    protected service: UsuarioService,
    protected formBuilderService: FormBuilderService,
    protected alertService: AlertService,
    protected scroolService: NbLayoutScrollService,
    protected dialogService: NbDialogService,
    private menuUsuarioService: MenuUsuarioService,
    private menuSistemaService: MenuSistemaService,
  ) 
  {
    super(Classes.USUARIO, formBuilderService, service, alertService, scroolService, dialogService);
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
