import { Component, Input, OnInit } from "@angular/core";
import { Validators, FormBuilder } from "@angular/forms";
import { NbDialogRef } from "@nebular/theme";
import { PERFIL_MENU } from "../../../@core/enum/const-dropbox";
import { SessionStorageService } from "../../../@core/services/util/session-storage.service";
import { IDropDown } from "../../../@core/data/drop-down";

@Component({
  selector: "ngx-menu-usuario",
  templateUrl: "./menu-usuario.component.html",
  styleUrls: ["./menu-usuario.component.scss"],
})
export class MenuUsuarioComponent implements OnInit {
  public perfilMenu = PERFIL_MENU;
  @Input() menusSistemaUsuario: any[] = [];
  public menusSistema: IDropDown[] = [];
  public control = this.formBuilder.group({
    id: ["", null],
    menusSistema: [[""], Validators.required],
    usuarioId: ["", Validators.required],
    tipoPerfil: ["CONSULTIVO", Validators.required],
  });

  constructor(
    protected dialogRef: NbDialogRef<MenuUsuarioComponent>,
    private formBuilder: FormBuilder
  ) {}

  async ngOnInit() {
    this.control.patchValue({
      usuarioId: SessionStorageService.getUsuarioId(),
      menusSistema: [],
    });
    if (!SessionStorageService.isSysAdm())
      this.perfilMenu = PERFIL_MENU.filter(t => t.id !== '0'); 
  }

  cancel() {
    this.dialogRef.close();
  }

  submit() {
    var menus = [];
    this.control.value.menusSistema.forEach((menuId) => {
      var subMenu = this.filterById(menuId);
      menus.push({ id: menuId, desc: subMenu?.descricao });
    });

    this.control.patchValue({ menusSistema: menus });
    this.dialogRef.close(this.control.value);
  }

  filterById(id: string, data?: IDropDown[]): IDropDown {
    let result: IDropDown[] = [];
    data = data ?? this.menusSistema;

    data.forEach((item) => {
      if (item.id === id) {
        result.push(item);
      }
      if (item.subGrupo) {
        const subGrupoResult = this.filterById(id, item.subGrupo);
        if (subGrupoResult) result = result.concat(subGrupoResult);
      }
    });
    return result.pop();
  }

  private showSubMenuById(id: string): boolean {
    let result: boolean = true;
    this.menusSistemaUsuario.forEach((item) => {
      if (item.menuSistemaId === id) {
        result = false;
      }
      if (item.subGrupo) {
        this.filterById(id, item.subGrupo);
      }
    });
    return result;
  }

  showSubMenu(subMenus: IDropDown[]) {
    return subMenus.filter((sM) => ((sM.descricao != 'Menus do Sistema' && sM.descricao != 'Ghost') || SessionStorageService.isSysAdm()) && this.showSubMenuById(sM.id));
  }
}
