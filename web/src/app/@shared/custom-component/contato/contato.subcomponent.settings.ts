import { NbIconConfig } from "@nebular/theme";
import { IContato } from "../../../@core/data/contato";
import { CheckboxComponent } from "../../../@shared/custom-component/checkbox-component";

export class ContatosSettings {
  checked: Array<IContato> = [];
  deleteIcon: NbIconConfig = { icon: "trash-2-outline", pack: "eva" };
  settings = {
    columns: {
      id: {
        title: "",
        type: "custom",
        width: "8px",
        class: "checkbox",
        renderComponent: CheckboxComponent,
        onComponentInitFunction: (instance) => {
          instance.event.subscribe((row) => {
            this.onCheckContato(row);
          });
        },
      },
      nome: {
        title: "Nome",
        type: "string",
      },
      telefone: {
        title: "Telefone",
        type: "string",
      },
      email: {
        title: "Email",
        type: "string",
      },
      cargo: {
        title: "Setor / Área",
        type: "string",
      }
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

  onCheckContato(data) {
    if (data.value) {
      this.checked.push(data.data);
    } else {
      this.checked = this.checked.filter(
        (a) => a.id != data.data.id
      );
    }
  }
}
