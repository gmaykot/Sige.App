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
        valuePrepareFunction: (value) => { return value ? Intl.NumberFormat('pt-BR', { maximumFractionDigits: 8, minimumFractionDigits: 2 }).format(value) : '-' },
      },
      cofins: {
        title: "COFINS",
        type: "string",
        filter: false,
        valuePrepareFunction: (value) => { return value ? Intl.NumberFormat('pt-BR', { maximumFractionDigits: 8, minimumFractionDigits: 2 }).format(value) : '-' },
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
    pager: {
      perPage: 20
    }
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
      proinfa: {
        title: "Proinfa",
        type: "string",
        filter: false,
        valuePrepareFunction: (value) => { return value ? Intl.NumberFormat('pt-BR', { maximumFractionDigits: 8, minimumFractionDigits: 2 }).format(value) : '-' },
      },
      icms: {
        title: "ICMS",
        type: "string",
        filter: false,
        valuePrepareFunction: (value) => { return value ? Intl.NumberFormat('pt-BR', { maximumFractionDigits: 8, minimumFractionDigits: 2 }).format(value) : '-' },
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
    pager: {
      perPage: 20
    }
  };

  export const descontoTusd = {
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
      descAgenteMedicao: {
        title: "Agente de Medição",
        type: "string",
      },
      codPerfil: {
        title: "Código Perfil",
        type: "string",
      },
      empresasVinculadas: {
        title: "Empresas Vinculadas",
        type: "string",
        filter: false,
      },
      descontoTUSD: {
        title: "Desconto TUSD",
        type: "string",
        filter: false,
        valuePrepareFunction: (value) => { return value ? Intl.NumberFormat('pt-BR', { maximumFractionDigits: 8, minimumFractionDigits: 2 }).format(value) : '-' },
      },
    },
    actions: {
      add: false,
      edit: false,
      delete: true,
      position: "right",
      columnTitle: "",
    },
    noDataMessage: "Nenhum registro encontrado.",
    pager: {
      perPage: 20
    }
  };