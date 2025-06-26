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
      valorPis: {
        title: "PIS",
        type: "string",
        valuePrepareFunction: (value) => { return Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(value) },
      },
      valorCofins: {
        title: "COFINS",
        type: "string",
        valuePrepareFunction: (value) => { return Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(value) },
      }
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
        descPontoMedicao: {
        title: "Ponto de Medição",
        type: "string",
      },
      valorProinfa: {
        title: "Proinfa",
        type: "string",
        valuePrepareFunction: (value) => { return Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(value) },
      },
      valorIcms: {
        title: "ICMS",
        type: "string",
        valuePrepareFunction: (value) => { return Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(value) },
      }
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