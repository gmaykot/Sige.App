import { DatePipe } from "@angular/common";

export const settingsTotais = {
    hideSubHeader: true,
    columns: {
      somaConsumoAtivo: {
        title: "Total Consumo Ativo (kWh)",
        type: "number",
        valuePrepareFunction: (value) => { return Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 }).format(value)}
      },
      somaConsumoReativo: {
        title: "Total Consumo Reativo (kWh)",
        type: "number",
        valuePrepareFunction: (value) => { return Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 }).format(value)}
      },
      mediaConsumoAtivo: {
        title: "Média Consumo Ativo (kWh)",
        type: "number",
        valuePrepareFunction: (value) => { return Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 }).format(value)}
      },
      mediaConsumoReativo: {
        title: "Média Consumo Reativo (kWh)",
        type: "number",
        valuePrepareFunction: (value) => { return Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 }).format(value)}
      },
    },
    actions: {
      add: false,
      edit: false,
      delete: false,
      position: "right",
      columnTitle: "",
    },
    noDataMessage: 'Nenhum registro encontrado.'
  };
  
  export const settingsMedicao = {
    delete: {
      deleteButtonContent: '<i class="nb-edit"></i>',
      confirmDelete: true,
    },
    columns: {
      periodo: {
        title: "Dia Medição",
        type: "string",
        filter: false,
        valuePrepareFunction: (value) => { return new DatePipe('pt-BR').transform(value, 'dd/MM/yyyy - HH:mm')},
      },
      pontoMedicao: {
        title: "Ponto Medição",
        type: "string",
        filter: false,
      },
      status: {
        title: "Status",
        type: "string",
        width: '100px',
        filter: {
          type: 'list',
          config: {
            selectText: '',
            list: [
              { value: 'HCC', title: 'HCC' },
              { value: 'HIF', title: 'HIF' },
            ],
          },   
        }     
      },
      consumoAtivo: {
        title: "Total Consumo (kWh)",
        type: "number",
        valuePrepareFunction: (value) => { return Intl.NumberFormat('pt-BR', { maximumFractionDigits: 3, minimumFractionDigits: 3 }).format(value)},
        filterFunction(cell?: any, search?: string): boolean {
          const formatted = Intl.NumberFormat('pt-BR', { maximumFractionDigits: 3, minimumFractionDigits: 3 }).format(cell || 0);
          return formatted.includes(search || '');
        }
      },
      consumoReativo: {
        title: "Média Consumo (kWh)",
        type: "number",
        valuePrepareFunction: (value) => { return Intl.NumberFormat('pt-BR', { maximumFractionDigits: 3, minimumFractionDigits: 3 }).format(value)},
        filterFunction(cell?: any, search?: string): boolean {
          const formatted = Intl.NumberFormat('pt-BR', { maximumFractionDigits: 3, minimumFractionDigits: 3 }).format(cell || 0);
          return formatted.includes(search || '');
        }
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