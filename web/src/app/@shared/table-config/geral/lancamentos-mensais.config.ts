export const impostosSettings = {
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
        descConcessionaria: {
        title: "Concessionária",
        type: "string",
      },
      pis: {
        title: "PIS",
        type: "string",
        filter: false,
        valuePrepareFunction: (value) => { return value ? Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(value) : '-' },
      },
      cofins: {
        title: "COFINS",
        type: "string",
        filter: false,
        valuePrepareFunction: (value) => { return value ? Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(value) : '-' },
      }
    },
    actions: {
      add: false,
      edit: false,
      delete: true,
      position: "right",
      columnTitle: "",
    },
    noDataMessage: "Nenhum registro encontrado.",
  };

  export const proinfaSettings = {
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
      descEmpresa: {
        title: "Empresa",
        type: "string",
      },
      descPontoMedicao: {
        title: "Ponto de Medição",
        type: "string",
      },
      valorProinfa: {
        title: "Proinfa",
        type: "string",
        filter: false,
        valuePrepareFunction: (value) => { return value ? Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(value) : '-' },
      },
      valorIcms: {
        title: "ICMS",
        type: "string",
        filter: false,
        valuePrepareFunction: (value) => { return value ? Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(value) : '-' },
      }
    },
    actions: {
      add: false,
      edit: false,
      delete: true,
      position: "right",
      columnTitle: "",
    },
    noDataMessage: "Nenhum registro encontrado.",
  };