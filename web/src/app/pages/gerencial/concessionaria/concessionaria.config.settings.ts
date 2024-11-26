import { IConcessionaria } from "../../../@core/data/concessionarias";
import { UF } from "../../../@core/data/estados";
import { CheckboxComponent } from "../../../@shared/custom-component/checkbox-component";
import { concessionariaSettings } from "../../../@shared/table-config/concessionaria.config";
import { DefaultComponent } from "../../default-component";

export class ConcessionariaConfigSettings extends DefaultComponent<IConcessionaria> {
    public settings = concessionariaSettings;
    public estados = UF;
    public impostosChecked = [];

    public settingsImpostos = {
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
          id: {
            title: '',
            type: 'custom',
            width: '8px',
            class: 'checkbox',
            renderComponent: CheckboxComponent,
            onComponentInitFunction: (instance)=>{
              instance.event.subscribe(row => {
                this.onCheckImpostos(row);
              });
            },
            filter: {
              width: '8px',
              type: 'custom',
              class: 'checkbox',
              component: CheckboxComponent
            }
          },    
          mesReferencia: {
            title: "Mês Referência",
            type: "string",
          },
          valorPis: {
            title: "PIS",
            type: "string"
          },
          valorCofins: {
            title: "COFINS",
            type: "string"
          },
        },
        actions: {
          add: false,
          edit: false,
          delete: false,
          position: "right",
          columnTitle: "",
        },
        hideSubHeader: true,
        noDataMessage: "Nenhum registro encontrado.",
      };

    onCheckImpostos(data) {
        if (data.value) {
            this.impostosChecked.push(data.data);
        } else {
            this.impostosChecked = this.impostosChecked.filter(a => a.id != data.data.id);
        }
    }
}