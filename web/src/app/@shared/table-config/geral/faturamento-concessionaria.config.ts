import { DatePipe } from "@angular/common";

export const faturamentoSettings = {
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
        title: "Ponto Medição",
        type: "string"
      },
      vigenciaInicial: {
        title: "Vigência Inicial",
        type: "string",
        valuePrepareFunction: (value) => { return new DatePipe('pt-BR').transform(value, 'dd/MM/yyyy')},
      },
      vigenciaFinal: {
        title: "Vigência Final",
        type: "string",
        valuePrepareFunction: (value) => { return new DatePipe('pt-BR').transform(value, 'dd/MM/yyyy')},
      },
      valorFixo: {
        title: "Valor Fixo",
        type: "string",
        valuePrepareFunction: (value) => { return Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(value) },
      },
      qtdeSalarios: {
        title: "Qtde. Salários",
        type: "string"
      },
      porcentagem: {
        title: "Porcentagem",
        type: "string",
        valuePrepareFunction: (value) => { return Intl.NumberFormat('pt-BR', { maximumFractionDigits: 3, minimumFractionDigits: 2 }).format(value) },
      },
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
  
  
  