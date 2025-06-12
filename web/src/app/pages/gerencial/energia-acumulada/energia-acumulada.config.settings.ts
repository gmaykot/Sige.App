export class EnergiaAcumuladaConfigSettings {
  settingsEnergiaAcumulada = {
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
      pontoMedicaoDesc: {
        title: "Ponto de Medição",
        type: "string",        
      },
      mesReferencia: {
        title: "Mês Referência",
        type: "string",
      },
      valorMensalAcumulado: {
        title: "Energia Mensal Acumulada",
        type: "number",
        valuePrepareFunction: (value) => { return Intl.NumberFormat('pt-BR', { maximumFractionDigits: 5, minimumFractionDigits: 2 }).format(value) },
        filter: null
      },
      valorTotalAcumulado: {
        title: "Energia Total Acumulada",
        type: "number",
        valuePrepareFunction: (value) => { return Intl.NumberFormat('pt-BR', { maximumFractionDigits: 5, minimumFractionDigits: 2 }).format(value) },
        filter: null
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

  settingsHistorico = {
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
      valorMensalAcumulado: {
        title: "Energia Mensal Acumulada",
        type: "number",
        valuePrepareFunction: (value) => { return Intl.NumberFormat('pt-BR', { maximumFractionDigits: 5, minimumFractionDigits: 2 }).format(value) },
      },
      valorTotalAcumulado: {
        title: "Energia Total Acumulada",
        type: "number",
        valuePrepareFunction: (value) => { return Intl.NumberFormat('pt-BR', { maximumFractionDigits: 5, minimumFractionDigits: 2 }).format(value) },
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
}