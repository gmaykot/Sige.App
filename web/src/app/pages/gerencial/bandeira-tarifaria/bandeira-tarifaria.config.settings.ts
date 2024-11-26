import { DatePipe } from "@angular/common";
import { DateFilterComponent } from "../../../@shared/custom-component/filters/date-filter.component";

export class BandeiraTarifariaConfigSettings {
    
    settingsBandeiraTarifaria = {
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
          dataVigenciaInicial: {
            title: "Vigência Inicial",
            type: "string",
            valuePrepareFunction: (value) => { return new DatePipe('pt-BR').transform(value, 'dd/MM/yyyy')},
            filter: {
              type: 'custom',
              component: DateFilterComponent,
            }
          },
          dataVigenciaFinal: {
            title: "Vigência Final",
            type: "string",
            valuePrepareFunction: (value) => { return new DatePipe('pt-BR').transform(value, 'dd/MM/yyyy')},
            filter: {
              type: 'custom',
              component: DateFilterComponent,
            }
          },
          valorBandeiraVerde: {
            title: "Valor Verde",
            type: "number",
            valuePrepareFunction: (value) => { return Intl.NumberFormat('pt-BR', { maximumFractionDigits: 5, minimumFractionDigits: 2 }).format(value) },
            filter: null
          },
          valorBandeiraAmarela: {
            title: "Valor Amarela",
            type: "number",
            valuePrepareFunction: (value) => { return Intl.NumberFormat('pt-BR', { maximumFractionDigits: 5, minimumFractionDigits: 2 }).format(value) },
            filter: null
          },
          valorBandeiraVermelha1: {
            title: "Valor Vermelha I",
            type: "number",
            valuePrepareFunction: (value) => { return Intl.NumberFormat('pt-BR', { maximumFractionDigits: 5, minimumFractionDigits: 2 }).format(value) },
            filter: null
          },
          valorBandeiraVermelha2: {
            title: "Valor Vermelha II",
            type: "number",
            valuePrepareFunction: (value) => { return Intl.NumberFormat('pt-BR', { maximumFractionDigits: 5, minimumFractionDigits: 2 }).format(value) },
            filter: null
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
}