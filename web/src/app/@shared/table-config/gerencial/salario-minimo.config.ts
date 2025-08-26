import { StatusIconComponent } from "../../custom-component/status-icon/status-icon.component";

export const salarioMinimoSettings = {
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
    status: {
      title: "",
      type: "custom",
      renderComponent: StatusIconComponent,
      width: "10px",
      filter: false,
      sort: false,
      addable: false,
      editable: false,
    },
    vigenciaInicial: {
      title: "Vigência Inicial",
      type: "string",
    },
    vigenciaFinal: {
      title: "Vigência Final",
      type: "string",
    },
    valor: {
      title: "Valor (R$)",
      type: "string",
      valuePrepareFunction: (value) => { 
        return Intl.NumberFormat('pt-BR', { 
          maximumFractionDigits: 2, 
          minimumFractionDigits: 2 
        }).format(value) 
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
  hideSubHeader: true,
  noDataMessage: "Nenhum registro encontrado.",
};