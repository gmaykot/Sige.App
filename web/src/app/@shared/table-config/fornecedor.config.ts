export const settingsFornecedor = {
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
      cnpj: {
        title: "CNPJ",
        type: "string",
        class: "cnpj"
      },
      nome: {
        title: "Nome",
        type: "string",
      },
      telefoneContato: {
        title: "Telefone Contato",
        type: "string",
      },
      telefoneAlternativo: {
        title: "Telefone Alternativo",
        type: "string",
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
    noDataMessage: 'Nenhum registro encontrado.'
  };