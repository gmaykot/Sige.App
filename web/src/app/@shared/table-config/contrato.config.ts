import { DatePipe } from "@angular/common";
import { STATUS_CONTRATO, TIPO_ENERGIA } from "../../@core/enum/status-contrato";
import { DateFilterComponent } from "../custom-component/filters/date-filter.component";


const tipoEnergiaToList = Object.values(TIPO_ENERGIA).map(value => {
  return { value: value.id, title: value.desc };
});

const statusToList = Object.values(STATUS_CONTRATO).map(value => {
  return { value: value.id, title: value.desc };
});

export const settingsContrato = {
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
      numero: {
        title: "Número",
        type: "string",
      },
      tipoEnergia: {
        title: "Tipo Energia",
        type: "string",
        valuePrepareFunction: (value) => { return TIPO_ENERGIA.find(f => f.id == value).desc},
        filter: {
          type: 'list',
          config: {
            selectText: 'Selecione...',
            list: tipoEnergiaToList,
          },
        },        
      },
      dscGrupo: {
        title: "Grupo de Empresas",
        type: "string",
      },      
      dataVigenciaInicial: {
        title: "Vigência Inicial",
        type: "string",
        valuePrepareFunction: (value) => { return new DatePipe('pt-BR').transform(value, 'dd/MM/yyyy')},
        filter: {
          type: 'custom',
          component: DateFilterComponent,
        }
      },
      dataVigenciaFinal: {
        title: "Vigência Final",
        type: "string",
        valuePrepareFunction: (value) => { return new DatePipe('pt-BR').transform(value, 'dd/MM/yyyy')},
        filter: {
          type: 'custom',
          component: DateFilterComponent,
        }
      },
      descFornecedor: {
        title: "Fornecedor",
        type: "string",
      },
      status: {
        title: "Status",
        type: "string",
        valuePrepareFunction: (value) => { return STATUS_CONTRATO.find(f => f.id == value).desc},
        filter: {
          type: 'list',
          config: {
            selectText: 'Selecione...',
            list: statusToList,
          },
        },         
      },
    },
    actions: {
      add: false,
      edit: false,
      delete: true,
      position: "right",
      columnTitle: "",
    },
    noDataMessage: 'Nenhum registro encontrado.'
  };