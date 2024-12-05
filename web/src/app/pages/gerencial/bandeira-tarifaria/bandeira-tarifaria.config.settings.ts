import { DateFilterComponent } from "../../../@shared/custom-component/filters/date-filter.component";
import { IBandeiraTarifariaVigente } from "../../../@core/data/bandeira-tarifaria-vigente";
import { BANDEIRAS } from "../../../@core/enum/const-dropbox";
import { CheckboxComponent } from "../../../@shared/custom-component/checkbox-component";

export class BandeiraTarifariaConfigSettings {
    public bandeirasChecked:IBandeiraTarifariaVigente[] = [];

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
        vigenciaInicial: {
          title: "Vigência Inicial",
          type: "string",
          filter: {
            type: 'custom',
            component: DateFilterComponent,
          }
        },
        vigenciaFinal: {
          title: "Vigência Final",
          type: "string",
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

    settingsBandeiras = {
      columns: {
        id: {
          title: '',
          type: 'custom',
          width: '8px',
          class: 'checkbox',
          renderComponent: CheckboxComponent,
          onComponentInitFunction: (instance)=>{
            instance.event.subscribe(row => {
              this.onCheckBandeiras(row);
            });
          },
          filter: {
            width: '8px',
            type: 'custom',
            class: 'checkbox',
            component: CheckboxComponent
          }
        }, 
        mesReferencia: {
          title: "Mês Referência",
          type: "string",
        },        
        bandeira: {
          title: "Bandeira Vigente",
          type: "string",          
          valuePrepareFunction: (value) => { return BANDEIRAS.filter(a => a.id == value)[0].desc },
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

    onCheckBandeiras(data) {
      if (data.value) {
          this.bandeirasChecked.push(data.data);
      } else {
          this.bandeirasChecked = this.bandeirasChecked.filter(a => a.id != data.data.id);
      }
  }
}