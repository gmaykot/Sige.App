import { Component } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { MenuSistemaService } from '../../../@core/services/administrativo/menu-sistema.service';
import { IMenuSistema } from '../../../@core/data/menu-sistema';
import { IResponseIntercace } from '../../../@core/data/response.interface';
import { settingsMenuSistema } from '../../../@shared/table-config/menu-sistema.config';
import { NbDialogService } from '@nebular/theme';
import { CustomDeleteConfirmationComponent } from '../../../@shared/custom-component/custom-delete-confirmation.component';

@Component({
  selector: 'ngx-menu-sistema',
  templateUrl: './menu-sistema.component.html',
  styleUrls: ['./menu-sistema.component.scss']
})
export class MenuSistemaComponent {
  settings = settingsMenuSistema;
  source: LocalDataSource = new LocalDataSource();
  loading: boolean = false;
  public successMesage = null;
  public edit = false;
  menus:IMenuSistema[];
  public control = this.formBuilder.group({
    id: "",
    menuPredecessorId: "",
    title: "",
    link: "",
    expanded: new FormControl(),
    icon: "",
    ordem: new FormControl()
  });

  constructor(
    private formBuilder: FormBuilder,
    private menuSistema: MenuSistemaService,
    private dialogService: NbDialogService
  ) {
    this.getMenusSistema()
  }

  async getMenusSistema()
  {
    this.loading = true;
    await this.menuSistema.get().then((response: IResponseIntercace<IMenuSistema[]>) => {
      this.menus = response.data;
      this.source.load(response.data);
      this.loading = false;
    });
    this.loading = false;   
  }

  onSelect(event): void {
    this.limparFormulario()
    const menu = event.data as IMenuSistema;
    this.control = this.formBuilder.group({
      id: menu.id,
      menuPredecessorId: menu.menuPredecessorId,
      title: menu.title,
      link: menu.link,
      expanded: menu.expanded || false,
      icon: menu.icon,
      ordem: menu.ordem
    });
    this.edit = true;
  }

  onSubmit(): void {
    this.changeMenu();
  }

  private getMenu(): IMenuSistema {
    return this.control.value as IMenuSistema;
  }

  limparFormulario(): void {
    this.control.reset();
    this.edit = false;
  }

  private async changeMenu() {
    const menu = this.getMenu();
    if (menu.id == null || menu.id == "") {
      await this.post(menu);
    } else {
      await this.put(menu);
    }
    this.limparFormulario();
  }

  private async post(menu: IMenuSistema) {
    await this.menuSistema.post(menu).then();
    {
      await this.getMenusSistema();
      this.setSuccessMesage("Menu cadastrado com sucesso.");
    }
  }

  private async put(menu: IMenuSistema) {
    await this.menuSistema.put(menu).then();
    {
      await this.getMenu();
      this.setSuccessMesage("Menu alterado com sucesso.");
    }
  }

  private setSuccessMesage(mensagem): void {
    this.successMesage = mensagem;
    setTimeout(() => {
      this.successMesage = null;
    }, 10000);
  }

  async onDeleteConfirm() {
    this.dialogService
      .open(CustomDeleteConfirmationComponent)
      .onClose.subscribe(async (excluir) => {
        if (excluir) {
          await this.menuSistema
          .delete(this.getMenu().id)
          .then();
        {
          this.limparFormulario();
          this.setSuccessMesage("Menu excluído com sucesso.");
          await this.getMenusSistema();
        }
        }
      });
  }
}
