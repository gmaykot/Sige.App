import { Component, OnInit } from '@angular/core';
import { EmpresaService } from '../../../@core/services/gerencial/empresa.service';
import { ContratoService } from '../../../@core/services/gerencial/contrato.service';
import { FormBuilder, Validators } from '@angular/forms';
import { IDropDown } from '../../../@core/data/drop-down';
import { IResponseInterface } from '../../../@core/data/response.interface';
import { IContratoEmpresas } from '../../../@core/data/contrato-empresas';
import { AlertService } from '../../../@core/services/util/alert.service';
import { IUsuario, Usuario } from '../../../@core/data/usuario';
import { SessionStorageService } from '../../../@core/services/util/session-storage.service';
import { LocalDataSource } from 'ng2-smart-table';
import { UsuarioConfigSettings } from './usuario.config.settings';
import { UsuarioService } from '../../../@core/services/administrativo/usuario.service';
import { NbDialogService, NbLayoutScrollService } from '@nebular/theme';
import { ETipoPerfil } from '../../../@core/enum/ETipoPerfil';
import { CustomDeleteConfirmationComponent } from '../../../@shared/custom-component/custom-delete-confirmation.component';
import { Classes } from '../../../@core/enum/classes.const';
import { DateService } from '../../../@core/services/util/date.service';
import { FormBuilderService } from '../../../@core/services/util/form-builder.service';
import { PERFIL_MENU } from '../../../@core/enum/const-dropbox';
import { IMenuSistema } from '../../../@core/data/menu-sistema';
import { MenuUsuarioComponent } from '../../../@shared/custom-component/menu-usuario/menu-usuario.component';
import { IMenuUsuario } from '../../../@core/data/menu-usuario';

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
    protected dialogService: NbDialogService
  ) 
  {
    super(Classes.USUARIO, formBuilderService, service, alertService, scroolService, dialogService);
  }

  async onConfirmMenu() {
    var menus = await this.sourceMenu.getAll();

    this.dialogService
      .open(MenuUsuarioComponent, { context: { menusSistemaUsuario: menus } })
      .onClose.subscribe(async (response) => {
        if (response) {          
          response.menusSistema.forEach(menuSistema => {
            const menu: IMenuUsuario = {
              menuSistemaId: menuSistema.id,
              menuSistemaDesc: menuSistema.desc,
              usuarioId: response.usuarioId,
              tipoPerfil: response.tipoPerfil
            }
            menus.push(menu);
          });
          this.sourceMenu.load(menus);
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
            var menus = await this.sourceMenu.getAll();
            this.sourceMenu.load(menus.filter(m => m.menuSistemaId != menu.menuSistemaId));
          });
          this.alertService.showSuccess("Registros excluídos com sucesso.");
          this.checked = [];
        }
      });          
    }
  }
}
