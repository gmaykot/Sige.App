import { DatePipe } from "@angular/common";
import { TIPO_LANCAMENTO } from "../../@core/enum/status-contrato";

export const settingsFatura = {
  delete: {
    deleteButtonContent: '<i class="nb-compose"></i>',
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
    pontoMedicaoDesc: {
      title: "Ponto de Medição",
      type: "string",
    },
    concessionariaDesc: {
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
    validado: {
      title: "Validado",
      type: "string",
      valuePrepareFunction: (value) => {
        return value == true ? 'SIM' : 'NÃO';
      },
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
    descricao: {
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
      valuePrepareFunction: (value) => { return TIPO_LANCAMENTO.find(f => f.id == value)?.desc},
    },
    contabilizaFatura: {
      title: "Contabiliza",
      type: "string",
      valuePrepareFunction: (value) => { return value == true ? 'SIM' : 'NÃO';},
    },
    tipoCCEE: {
      title: "CCEE",
      type: "string",
      valuePrepareFunction: (value) => { return value == true ? 'SIM' : 'NÃO';},
    },
  },
  hideSubHeader: true,
  noDataMessage: "Nenhum registro encontrado.",
};

export const settingsLancamentosSemDelete = {
  actions: {
    add: false,
    edit: false,
    delete: false,
  },
  columns: {
    descricao: {
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
      valuePrepareFunction: (value) => { return TIPO_LANCAMENTO.find(f => f.id == value)?.desc},
    },
    contabilizaFatura: {
      title: "Contabiliza",
      type: "string",
      valuePrepareFunction: (value) => { return value == true ? 'SIM' : 'NÃO';},
    },
    tipoCCEE: {
      title: "CCEE",
      type: "string",
      valuePrepareFunction: (value) => { return value == true ? 'SIM' : 'NÃO';},
    },

  },
  hideSubHeader: true,
  noDataMessage: "Nenhum registro encontrado.",
};
