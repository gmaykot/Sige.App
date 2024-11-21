import { NbIconConfig } from "@nebular/theme";
import { IContato } from "../../../@core/data/contato";
import { CheckboxComponent } from "../../../@shared/custom-component/checkbox-component";

export class FornecedorConfigSettings {
  contatosChecked: Array<IContato> = [];
  disabledIconConfig: NbIconConfig = { icon: "trash-2-outline", pack: "eva" };
  settingsContato = {
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
      this.contatosChecked.push(data.data);
    } else {
      this.contatosChecked = this.contatosChecked.filter(
        (a) => a.id != data.data.id
      );
    }
  }
}
