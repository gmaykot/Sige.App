import { DatePipe } from "@angular/common";
import { FASES_MEDICAO } from "../../@core/enum/filtro-medicao";
import { DateFilterComponent } from "../custom-component/filters/date-filter.component";

const faseToList = Object.values(FASES_MEDICAO).map(value => {
  return { value: value.id, title: value.desc };
});
export const settingsRelatorioMedicao =  {
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
    deleteButtonContent: '<i class="nb-compose"></i>',
    confirmDelete: true,
  },    
  columns: {
    contratoId: {
      title: "",
      type: "string",
      width: "0px",
      hide: true,
    },
    descGrupo: {
      title: "Grupo de Empresas",
      type: "string",
      filter: true
    },
    descFornecedor: {
      title: "Fornecedor",
      type: "string",
      filter: true
    },
    fase: {
      title: "Fase",
      type: "string",
      width: '250px',
      valuePrepareFunction: (value) => {
          return FASES_MEDICAO.find((f) => f.id == value).desc;
      },
      filter: {
        type: 'list',
        config: {
          selectText: 'Selecione...',
          list: faseToList,
        },
      }, 
    },
    mesReferencia: {
      title: "Mês Referência",
      type: "string",
      valuePrepareFunction: (value) => { return new DatePipe('pt-BR').transform(value, 'MM/yyyy')},
      width: '200px',
      filter: true
    },
    dataEmissao: {
      title: "Data Emissão",
      type: "string",
      valuePrepareFunction: (value) => { return new DatePipe('pt-BR').transform(value, 'dd/MM/yyyy')},
      width: '150px',
      filter: {
        type: 'custom',
        component: DateFilterComponent,
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
  hideSubHeader: false,
  noDataMessage: 'Nenhum registro encontrado.'
};

export const settingsResultadoEconomia =  { 
  columns: {
    faturamento: {
      title: "Faturamento",
      type: "string",
    },
    quantidade: {
      title: "Qtde (MWh)",
      type: "number",
      valuePrepareFunction: (value) => { return Intl.NumberFormat('pt-BR', { maximumFractionDigits: 3, minimumFractionDigits: 3 }).format(value)}
    },
    valorUnitario: {
      title: "Valor UN",
      type: "number",
      valuePrepareFunction: (value) => { return Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(value)}
    },
    valorICMS: {
      title: "Valor ICMS",
      type: "number",
      valuePrepareFunction: (value) => { return Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(value)}
    },
    valorProduto: {
      title: "Total Produto",
      type: "number",
      valuePrepareFunction: (value) => { return Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(value)}   
    },
    valorNota: {
      title: "Total Nota",
      type: "number",
      valuePrepareFunction: (value) => { return Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(value)}
    },
  },
  actions: {
    add: false,
    edit: false,
    delete: false,
    position: "right",
    columnTitle: "",
  },
  hideSubHeader: true,
  noDataMessage: 'Nenhum registro encontrado.'
};

export const settingsResultadoAnalitico =  { 
  pager: {
    display: true,
    perPage: 30
  },
  columns: {
    descEmpresa: {
      title: "Empresa",
      type: "string",
    },
    quantidade: {
      title: "Qtde MWh",
      type: "number",
      width: '90px',
      valuePrepareFunction: (value) => { return Intl.NumberFormat('pt-BR', { maximumFractionDigits: 3, minimumFractionDigits: 3 }).format(value)}
    },
    valorUnitario: {
      title: "Valor UN",
      type: "number",
      width: '90px',
      valuePrepareFunction: (value) => { return Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(value)}
    },
    comprarCurtoPrazo: {
      title: "Comprar MWh",
      type: "number",
      width: '90px',
      valuePrepareFunction: (value) => { return Intl.NumberFormat('pt-BR', { maximumFractionDigits: 3, minimumFractionDigits: 3 }).format(value)},
      hide: true
    },
    venderCurtoPrazo: {
      title: "Vender MWh",
      type: "number",
      width: '90px',
      valuePrepareFunction: (value) => { return Intl.NumberFormat('pt-BR', { maximumFractionDigits: 3, minimumFractionDigits: 3 }).format(value)},
      hide: true
    },
    valorICMS: {
      title: "ICMS Subs.",
      type: "number",
      width: '90px',
      valuePrepareFunction: (value) => { return Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(value)}
    },
    valorProduto: {
      title: "Total Produto",
      type: "number",
      width: '90px',
      valuePrepareFunction: (value) => { return Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(value)}   
    },
    valorNota: {
      title: "Total Nota",
      type: "number",
      width: '90px',
      valuePrepareFunction: (value) => { return Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(value)}
    },
  },
  actions: {
    add: false,
    edit: false,
    delete: false,
    position: "right",
    columnTitle: "",
  },
  hideSubHeader: true,
  noDataMessage: 'Nenhum registro encontrado.'
};

export const settingsRelatorioEconomia = {
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