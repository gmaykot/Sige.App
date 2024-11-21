import { UF } from "../../@core/data/estados";

const estadoToList = Object.values(UF).map(value => {
  return { value: value.sigla, title: value.sigla };
});

export const settingsEmpresa = {
  add: {
    addButtonContent: '<i class="nb-plus"></i>',
    createButtonContent: '<i class="nb-checkmark"></i>',
    cancelButtonContent: '<i class="nb-close"></i>',
  },
  edit: {
    editButtonContent: '<i class="nb-checkmark"></i>',
    saveButtonContent: '<i class="nb-checkmark"></i>',
    cancelButtonContent: '<i class="nb-close"></i>',
    confirmSave: true,
  },
  delete: {
    deleteButtonContent: '<i class="nb-edit"></i>',
    confirmDelete: true
  },
  columns: {
    nomeFantasia: {
      title: "Nome Fantasia",
      type: "string",
    },
    nome: {
      title: "Nome",
      type: "string",
    },
    cnpj: {
      title: "CNPJ",
      type: "string",
      class: "cnpj"
    },
    cidade: {
      title: "Cidade",
      type: "string",
    },
    estado: {
      title: "Estado",
      type: "string",
      class: "estado",
      valuePrepareFunction: (value) => { return UF.find(f => f.sigla == value).sigla},
      filter: {
        type: 'list',
        config: {
          selectText: 'Selecione...',
          list: estadoToList,
        },
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
  pager: {
    display: true,
    perPage: 20
  },
  noDataMessage: 'Nenhum registro encontrado.'
};