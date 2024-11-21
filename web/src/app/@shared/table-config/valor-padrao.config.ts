import { DatePipe } from "@angular/common";
import { BANDEIRAS } from "../../@core/enum/const-dropbox";

export const valorPadraoSettings = {
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
      competencia: {
        title: "Competência",
        type: "string",
        valuePrepareFunction: (value) => { return new DatePipe('pt-BR').transform(value, 'MM/yyyy')},
      },
      valorPis: {
        title: "PIS",
        type: "string",
        valuePrepareFunction: (value) => { return Intl.NumberFormat('pt-BR', { maximumFractionDigits: 3, minimumFractionDigits: 3 }).format(value)}
      },
      valorCofins: {
        title: "COFINS",
        type: "string",
        valuePrepareFunction: (value) => { return Intl.NumberFormat('pt-BR', { maximumFractionDigits: 3, minimumFractionDigits: 3 }).format(value)}
      },
      bandeira: {
        title: "Bandeira",
        type: "string",
        valuePrepareFunction: (value) => { return BANDEIRAS.find(f => f.id == value).desc},
      },
      valorBandeira: {
        title: "Valor Bandeira",
        type: "string",
        valuePrepareFunction: (value) => { return Intl.NumberFormat('pt-BR', { maximumFractionDigits: 3, minimumFractionDigits: 3 }).format(value)}
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