import { NbIconConfig } from "@nebular/theme";
import { settingsContrato } from "../../../@shared/table-config/contrato.config";
import { CheckboxComponent } from "../../../@shared/custom-component/checkbox-component";
import { IValorAnual } from "../../../@core/data/valor-anual";
import { IValorMensal } from "../../../@core/data/valor-mensal";
import { DatePipe } from "@angular/common";

export class ContratoConfigSettings {
  disabledIconConfig: NbIconConfig = { icon: "trash-2-outline", pack: "eva" };
  valoresAnuaisChecked: Array<IValorAnual> = [];
  valoresMensaisChecked: Array<IValorMensal> = [];
  empresasChecked: Array<IValorMensal> = [];

  settingsContrato = settingsContrato;
  settingsEmpresa = {
    delete: {
      deleteButtonContent: '<i class="nb-compose"></i>',
      confirmDelete: true,
    },
    columns: {
      id: {
        title: "",
        type: "custom",
        width: "8px",
        class: "checkbox",
        renderComponent: CheckboxComponent,
        onComponentInitFunction: (instance) => {
          instance.event.subscribe((row) => {
            this.onCheckEmpresas(row);
          });
        },
        filter: {
          width: "8px",
          type: "custom",
          class: "checkbox",
          component: CheckboxComponent,
        },
      },
      cnpjEmpresa: {
        title: "CNPJ",
        type: "string"
      },
      dscEmpresa: {
        title: "Nome",
        type: "string"
      }
    },
    actions: {
      add: false,
      edit: false,
      delete: false,
      position: "right",
    },
    hideSubHeader: true,
    noDataMessage: "Nenhum registro encontrado.",
  };

  settingsAnual = {
    delete: {
      deleteButtonContent: '<i class="nb-compose"></i>',
      confirmDelete: true,
    },
    columns: {
      id: {
        title: "",
        type: "custom",
        width: "8px",
        class: "checkbox",
        renderComponent: CheckboxComponent,
        onComponentInitFunction: (instance) => {
          instance.event.subscribe((row) => {
            this.onCheckValoresAnuais(row);
          });
        },
        filter: {
          width: "8px",
          type: "custom",
          class: "checkbox",
          component: CheckboxComponent,
        },
      },
      dataVigenciaInicial: {
        title: "Vigência Inicial",
        type: "string",        
        valuePrepareFunction: (value) => { return new DatePipe('pt-BR').transform(value, 'dd/MM/yyyy')},
      },
      dataVigenciaFinal: {
        title: "Vigência Final",
        type: "string",        
        valuePrepareFunction: (value) => { return new DatePipe('pt-BR').transform(value, 'dd/MM/yyyy')},
      },
      valorUnitarioKwh: {
        title: "Valor Unitário (R$)",
        type: "number",
        valuePrepareFunction: (value) => { return Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(value) }
      },
    },
    actions: {
      add: false,
      edit: false,
      delete: false,
      position: "right",
    },
    hideSubHeader: true,
    noDataMessage: "Nenhum registro encontrado.",
  };

  settingsMensal = {
    delete: {
      deleteButtonContent: '<i class="nb-compose"></i>',
      confirmDelete: true,
    },
    columns: {
      id: {
        title: "",
        type: "custom",
        width: "8px",
        class: "checkbox",
        renderComponent: CheckboxComponent,
        onComponentInitFunction: (instance)=>{
          instance.event.subscribe(row => {
            this.onCheckValoresMensais(row);
          });
        },
        filter: {
          width: "8px",
          type: "custom",
          class: "checkbox",
          component: CheckboxComponent,
        },
      },
      vigencia: {
        title: "Vigência",
        type: "string",
      },
      mesReferencia: {
        title: "Mês Referência",
        type: "string",        
        valuePrepareFunction: (value) => { return new DatePipe('pt-BR').transform(value, 'MM/yyyy')},
      },
      horasMes: {
        title: "Horas/Mês",
        type: "string",
        valuePrepareFunction: (value) => { return Intl.NumberFormat('pt-BR', { maximumFractionDigits: 4, minimumFractionDigits: 3 }).format(value) }
      },
      energiaContratada: {
        title: "Energia Contratada",
        type: "string",
        valuePrepareFunction: (value) => { return Intl.NumberFormat('pt-BR', { maximumFractionDigits: 4, minimumFractionDigits: 3 }).format(value) }
      },
    },
    actions: {
      add: false,
      edit: false,
      delete: false,
      position: "right",
    },
    pager: {
      display: true,
      perPage: 12
    },
    hideSubHeader: true,
    noDataMessage: "Nenhum registro encontrado.",
  };

  onCheckValoresAnuais(data) {
    if (data.value) {
      this.valoresAnuaisChecked.push(data.data);
    } else {
      this.valoresAnuaisChecked = this.valoresAnuaisChecked.filter(
        (a) => a.id != data.data.id
      );
    }
  }

  onCheckValoresMensais(data) {
    if (data.value) {
      this.valoresMensaisChecked.push(data.data);
    } else {
      this.valoresMensaisChecked = this.valoresMensaisChecked.filter(
        (a) => a.id != data.data.id
      );
    }
  }

  onCheckEmpresas(data) {
    if (data.value) {
      this.empresasChecked.push(data.data);
    } else {
      this.empresasChecked = this.empresasChecked.filter(
        (a) => a.id != data.data.id
      );
    }
  }
}
