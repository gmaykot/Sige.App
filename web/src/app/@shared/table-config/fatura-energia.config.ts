export const settingsFaturaEnergia = {
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
