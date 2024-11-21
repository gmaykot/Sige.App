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
    hideSubHeader: true,
    columns: {
      periodo: {
        title: "Dia Medição",
        type: "string",
        valuePrepareFunction: (value) => { return new DatePipe('pt-BR').transform(value, 'dd/MM/yyyy - HH:mm')},
      },
      pontoMedicao: {
        title: "Ponto Medição",
        type: "string",
      },
      status: {
        title: "Status",
        type: "string",
        filter: false,
        width: '100px'
      },
      consumoAtivo: {
        title: "Total Consumo (kWh)",
        type: "number",
        valuePrepareFunction: (value) => { return Intl.NumberFormat('pt-BR', { maximumFractionDigits: 3, minimumFractionDigits: 3 }).format(value)}
      },
      consumoReativo: {
        title: "Média Consumo (kWh)",
        type: "number",
        valuePrepareFunction: (value) => { return Intl.NumberFormat('pt-BR', { maximumFractionDigits: 3, minimumFractionDigits: 3 }).format(value)}
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