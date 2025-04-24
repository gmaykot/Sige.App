import { DatePipe } from "@angular/common";

export const settingsFatura = {
  delete: {
    deleteButtonContent: '<i class="nb-edit"></i>',
    confirmDelete: true,
  },   
  actions: {
    add: false,
    edit: false,
    delete: true,
    position: "right",
    columnTitle: "",
  },
  columns: {
    descPontoMedicao: {
      title: "Ponto de Medição",
      type: "string",
    },
    descConcessionaria: {
      title: "Concessionária",
      type: "string",
    },
    mesReferencia: {
      title: "Mês de Referência",
      type: "string",
      valuePrepareFunction: (value) => { return new DatePipe('pt-BR').transform(value, 'MM/yyyy')},
    },
    dataVencimento: {
      title: "Data de Vencimento",
      type: "string",
      valuePrepareFunction: (value) => { return new DatePipe('pt-BR').transform(value, 'dd/MM/yyyy')},
    },
  },
  hideSubHeader: true,
  noDataMessage: "Nenhum registro encontrado.",
};

export const settingsLancamentos = {
  delete: {
    deleteButtonContent: '<i class="nb-trash"></i>',
    confirmDelete: true,
  },
  actions: {
    add: false,
    edit: false,
    delete: true,
    position: "right",
    columnTitle: "",
  },
  columns: {
    lancamento: {
      title: "Lançamento",
      type: "string",
    },
    valor: {
      title: "Valor (R$)",
      type: "string",
      valuePrepareFunction: (value) => {
        return Intl.NumberFormat("pt-BR", {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2,
        }).format(value);
      },
    },
    tipo: {
      title: "Tipo",
      type: "string",
    },
  },
  hideSubHeader: true,
  noDataMessage: "Nenhum registro encontrado.",
};
