import { DatePipe } from "@angular/common";
import { IFaturamentoCoenel } from "../../../@core/data/geral/faturamento-coenel";
import { CheckboxComponent } from "../../../@shared/custom-component/checkbox-component";
import { DefaultComponent } from "../../../@shared/custom-component/default/default-component";
import { faturamentoSettings } from "../../../@shared/table-config/geral/faturamento-concessionaria.config";

export class FaturamentoCoenelConfigSettings extends DefaultComponent<IFaturamentoCoenel> {
    public settings = faturamentoSettings;
    public historicosChecked: Array<IFaturamentoCoenel> = [];

    public settingsHistoricos = {
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
            id: {
                title: '',
                type: 'custom',
                width: '8px',
                class: 'checkbox',
                renderComponent: CheckboxComponent,
                onComponentInitFunction: (instance) => {
                    instance.event.subscribe(row => {
                        this.onCheckHistoricos(row);
                    });
                },
                filter: {
                    width: '8px',
                    type: 'custom',
                    class: 'checkbox',
                    component: CheckboxComponent
                }
            },
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
            delete: false,
            position: "right",
            columnTitle: "",
        },
        hideSubHeader: true,
        noDataMessage: "Nenhum registro encontrado.",
    };

    onCheckHistoricos(data: any) {
        if (data.value) {
            this.historicosChecked.push(data.data);
        } else {
            this.historicosChecked = this.historicosChecked.filter(a => a.id != data.data.id);
        }
    }
}