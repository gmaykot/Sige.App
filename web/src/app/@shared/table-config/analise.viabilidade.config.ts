import { CustomDateComponent } from "../custom-component/custom-date.component";

export const settingsAnaliseViabilidade = {
  hideSubHeader: true,
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmCreate: true,
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true      
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    columns: {
      mesAno: {
        title: 'Mês/Ano',
        type: 'custom',
        renderComponent: CustomDateComponent,
        filter: false,
      },
      kwhPta: {
        title: 'kWh Pta',
        type: 'string',
        filter: false,
        valuePrepareFunction: (value) => { return value === 'Total'? value : Intl.NumberFormat('pt-BR').format(value)}
      },
      kwhFpta: {
        title: 'kWh Fpta',
        type: 'string',
        filter: false,
        valuePrepareFunction: (value) => { return value === 'Total'? value : Intl.NumberFormat('pt-BR').format(value)}
      },
      kwPta: {
        title: 'kW Pta',
        type: 'string',
        filter: false,
        valuePrepareFunction: (value) => { return value === 'Total'? value : Intl.NumberFormat('pt-BR').format(value)}
      },
      kwFpta: {
        title: 'kW Fpta',
        type: 'string',
        filter: false,
        valuePrepareFunction: (value) => { return value === 'Total'? value : Intl.NumberFormat('pt-BR').format(value)}
      },
      demandaPta: {
        title: 'Dem. FP',
        type: 'string',
        filter: false,
        valuePrepareFunction: (value) => { return value === 'Total'? value : Intl.NumberFormat('pt-BR').format(value)}
      },
      demandaFpta: {
        title: 'Dem. Pta',
        type: 'string',
        filter: false,
        valuePrepareFunction: (value) => { return value === 'Total'? value : Intl.NumberFormat('pt-BR').format(value)}
      }
    },
    actions: {
      add: false,
      edit: false,
      delete: false,
      position: 'right',
      columnTitle: ''
    },
    noDataMessage: 'Nenhum registro encontrado.',
    pager: {
      perPage: 20
    }
  };

  export const settingsAnaliseViabilidadeResponse = {
    hideSubHeader: false,
      columns: {
        tipoSegmento: {
          title: 'Segmento',
          type: 'string',
          filter: false
        },
        demPonta: {
          title: 'Dem P',
          type: 'string',
          filter: false,
          valuePrepareFunction: (value) => { return value === 'Total'? value : Intl.NumberFormat('pt-BR').format(value)}
        },
        demFPonta: {
          title: 'Dem FP',
          type: 'string',
          filter: false,
          valuePrepareFunction: (value) => { return value === 'Total'? value : Intl.NumberFormat('pt-BR').format(value)}
        },
        cusdPonta: {
          title: 'Cusd Ponta',
          type: 'string',
          filter: false,
          valuePrepareFunction: (value) => { return value === 'Total'? value : Intl.NumberFormat('pt-BR').format(value)}
        },
        cusdFPonta: {
          title: 'Cusd F Ponta',
          type: 'string',
          filter: false,
          valuePrepareFunction: (value) => { return value === 'Total'? value : Intl.NumberFormat('pt-BR').format(value)}
        },
        tusdPonta: {
          title: 'Tusd Ponta',
          type: 'string',
          filter: false,
          valuePrepareFunction: (value) => { return value === 'Total'? value : Intl.NumberFormat('pt-BR').format(value)}
        },
        tusdFPonta: {
          title: 'Tusd F Ponta',
          type: 'string',
          filter: false,
          valuePrepareFunction: (value) => { return value === 'Total'? value : Intl.NumberFormat('pt-BR').format(value)}
        },
        tusdPFPonta: {
          title: 'Tusd PF Ponta',
          type: 'string',
          filter: false,
          valuePrepareFunction: (value) => { return value === 'Total'? value : Intl.NumberFormat('pt-BR').format(value)}
        },
        kWhPonta: {
          title: 'kWh Ponta',
          type: 'string',
          filter: false,
          valuePrepareFunction: (value) => { return value === 'Total'? value : Intl.NumberFormat('pt-BR').format(value)}
        },
        kWhFPonta: {
          title: 'kWh F Ponta',
          type: 'string',
          filter: false,
          valuePrepareFunction: (value) => { return value === 'Total'? value : Intl.NumberFormat('pt-BR').format(value)}
        },
        total: {
          title: 'Total Conta',
          type: 'string',
          filter: false,
          valuePrepareFunction: (value) => { return value === 'Total'? value : Intl.NumberFormat('pt-BR').format(value)}
        },
        totalAno: {
          title: 'Total Ano',
          type: 'string',
          filter: false,
          valuePrepareFunction: (value) => { return value === 'Total'? value : Intl.NumberFormat('pt-BR').format(value)}
        },
        mediaMes: {
          title: 'Média Mês',
          type: 'string',
          filter: false,
          valuePrepareFunction: (value) => { return value === 'Total'? value : Intl.NumberFormat('pt-BR').format(value)}
        },
        mediaMesMwh: {
          title: 'Media kWh',
          type: 'string',
          filter: false,
          valuePrepareFunction: (value) => { return value === 'Total'? value : Intl.NumberFormat('pt-BR').format(value)}
        }
      },
      actions: {
        add: false,
        edit: false,
        delete: false,
        position: 'right',
        columnTitle: ''
      },
      noDataMessage: 'Nenhum registro encontrado.'
    };