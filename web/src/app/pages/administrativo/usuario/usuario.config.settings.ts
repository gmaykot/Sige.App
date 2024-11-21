import { NbIconConfig } from "@nebular/theme";
import { CheckboxComponent } from "../../../@shared/custom-component/checkbox-component";
import { IUsuario } from "../../../@core/data/usuario";
import { DefaultComponent } from "../../default-component";
export class UsuarioConfigSettings extends DefaultComponent<IUsuario>{
  checked: Array<any> = [];
  disabledIconConfig: NbIconConfig = { icon: "trash-2-outline", pack: "eva" };
  settingsUsuario = {
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    edit: {
      editButtonContent: '<i class="nb-gear"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true,
    },
    delete: {
      deleteButtonContent: '<i class="nb-edit"></i>',
      confirmDelete: true,
    },
    columns: {
      nome: {
        title: "Nome",
        type: "string",
      },
      apelido: {
        title: "Apelido",
        type: "string",
      },
      email: {
        title: "Login",
        type: "string",
      },
      ativo: {
        title: "Ativo",
        type: "string",
        valuePrepareFunction: (value) => {
          return value == true ? 'SIM' : 'NÃO';
        },
      }
    },
    actions: {
      add: false,
      edit: false,
      delete: true,
      position: "right",
      columnTitle: "",
    },
    hideSubHeader: true,
    noDataMessage: "Nenhum registro encontrado.",
  };

  settingsMenus = {
    columns: {
      id: {
        title: "",
        type: "custom",
        width: "8px",
        class: "checkbox",
        renderComponent: CheckboxComponent,
        onComponentInitFunction: (instance) => {
          instance.event.subscribe((row) => {
            this.onCheck(row);
          });
        },
      },      
      menuSistemaDesc: {
        title: "Menu Sistema",
        type: "string",
      },
      tipoPerfil: {
        title: "Perfil",
        type: "string",
      },
    },
    actions: {
      add: false,
      edit: false,
      delete: false,
      position: "right",
    },
    hideSubHeader: true,
    noDataMessage: "Nenhum registro encontrado.",
  };

  onCheck(data) {
    if (data.value) {
      this.checked.push(data.data);
    } else {
      this.checked = this.checked.filter(
        (a) => a.id != data.data.id
      );
    }
  }
}
