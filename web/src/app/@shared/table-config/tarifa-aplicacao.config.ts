import { DatePipe } from '@angular/common';
import { SEGMENTOS, SUB_GRUPOS } from '../../@core/enum/const-dropbox';

export const settingsTarifaAplicacao = {
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
      descConcessionaria: {
        title: 'Concessionária',
        type: 'string',
      },
      subGrupo: {
        title: 'Sub-Grupo',
        type: 'string',
        valuePrepareFunction: (value:number) => { return SUB_GRUPOS.find(f => f.id == value).desc},
      },
      segmento: {
        title: 'Segmento',
        type: 'string',
        valuePrepareFunction: (value:number) => { return SEGMENTOS.find(f => f.id == value).desc},
      },
      dataUltimoReajuste: {
        title: 'Último Reajuste',
        type: 'string'
      },
      numeroResolucao: {
        title: 'Nº Resolução',
        type: 'string',
      }
    },
    actions: {
      add: false,
      edit: false,
      delete: true,
      position: 'right',
      columnTitle: "",
    },
    hideSubHeader: true,
    noDataMessage: 'Nenhum registro encontrado.'
  };