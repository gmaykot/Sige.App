import { DatePipe } from "@angular/common";
import { STATUS_FASE, STATUS_MEDICAO } from "../../../@core/enum/filtro-medicao";
import { CheckboxComponent } from "../../../@shared/custom-component/checkbox-component";
import { IMedicao } from "../../../@core/data/medicao";
import { DateFilterComponent } from "../../../@shared/custom-component/filters/date-filter.component";

const statusToList = Object.values(STATUS_FASE[0].status).map(value => {
  return { value: value.id, title: value.desc };
});
export class MedicaoConfigSettings {
  medicoesChecked: Array<IMedicao> = [];
  settings = {
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
      deleteButtonContent: '<i class="nb-compose"></i>',
      confirmDelete: true,
    },
    columns: {
      CodAgente: {
        title: "",
        type: "string",
        width: "0px",
        hide: true,
      },
      contratoId: {
        title: "",
        type: "custom",
        width: "8px",
        class: "checkbox",
        filter: false,
        renderComponent: CheckboxComponent,
        onComponentInitFunction: (instance) => {
          instance.event.subscribe((row) => {
            this.onCheckMedicao(row);
          });
        },
      },
      descEmpresa: {
        title: "Empresa",
        type: "string",
        filter: true,
      },
      descPontoMedicao: {
        title: "Ponto de Medição",
        type: "string",
        filter: true,
      },
      pontoMedicao: {
        title: "Cod. Ponto",
        type: "string",
        width: "200px",
        filter: true,
      },
      statusMedicao: {
        title: "Status",
        type: "string",
        valuePrepareFunction: (value) => {
          return STATUS_MEDICAO.find((f) => f.id == value).desc;
        },
        width: "140px",
        filter: {
          type: 'list',
          config: {
            selectText: 'Selecione...',
            list: statusToList,
          },
        }, 
      },
      periodo: {
        title: "Mês Referência",
        type: "string",
        valuePrepareFunction: (value) => {
          return new DatePipe("pt-BR").transform(value, "MM/yyyy");
        },
        width: "110px",
        class: "center",
        filter: true,
      },
      dataMedicao: {
        title: "Medição",
        type: "string",
        valuePrepareFunction: (value) => {
          return new DatePipe("pt-BR").transform(value, "dd/MM/yyyy");
        },
        width: "120px",
        filter: {
          type: 'custom',
          component: DateFilterComponent,
        }
      },
    },
    actions: {
      add: false,
      edit: false,
      delete: true,
      position: "right",
      columnTitle: "",
    },
    pager: {
      display: true,
      perPage: 20
    },
    hideSubHeader: false,
    noDataMessage: "Nenhum registro encontrado.",
  };

  onCheckMedicao(data) {
    if (data.value) {
      this.medicoesChecked.push(data.data);
    } else {
      this.medicoesChecked = this.medicoesChecked.filter(
        (a) => a.id != data.data.Id
      );
    }
  }
}
