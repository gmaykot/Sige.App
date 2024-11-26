export const concessionariaSettings = {
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
    estado: {
      title: "Estado",
      type: "string",
      class: "estado",
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

export const impostoSettings = {
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
    mesReferencia: {
      title: "Mês Referência",
      type: "string",
    },
    pis: {
      title: "PIS",
      type: "string"
    },
    confins: {
      title: "CONFINS",
      type: "string"
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