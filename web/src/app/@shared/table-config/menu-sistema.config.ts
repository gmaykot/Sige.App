export const settingsMenuSistema = {
    delete: {
      deleteButtonContent: '<i class="nb-edit"></i>',
      confirmDelete: true,
    },
    columns: {
      title: {
        title: "Título",
        type: "string",
      },
      descPredecessor: {
        title: "Predecessor",
        type: "string",
      },
      link: {
        title: "Link",
        type: "string",
      },
      icon: {
        title: "Ícone",
        type: "string",
      },
      ordem: {
        title: "Ordem",
        type: "string",
      }
    },
    actions: {
      add: false,
      edit: false,
      delete: true,
      position: "right",
    },
    hideSubHeader: true,
    noDataMessage: 'Nenhum registro encontrado.'
  };