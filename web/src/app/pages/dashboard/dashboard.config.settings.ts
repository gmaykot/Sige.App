import { style } from "@angular/animations";
import { DeleteActionLinkComponent } from "../../@shared/custom-component/delete-action-link/delete-action-link.component";

export interface CardSettings {
    title: string;
    iconClass: string;
    type: string;
    link: string;
  }

export class DashboardConfigSettings {
    viabilidadeCard: CardSettings = {
        title: "Coletar Medições",
        iconClass: "nb-bar-chart",
        type: "primary",
        link: "/pages/medicao",
      };
      economiaCard: CardSettings = {
        title: "Relatório de Medição",
        iconClass: "nb-compose",
        type: "primary",
        link: "/pages/relatorio-medicao",
      };
    
      contratoCard: CardSettings = {
        title: "Contratos",
        iconClass: "nb-tables",
        type: "primary",
        link: "/pages/contratos",
      };

      faturamentoCard: CardSettings = {
        title: "Faturamento Coenel",
        iconClass: "nb-tables",
        type: "primary",
        link: "/pages/faturamento-coenel",
      };
    
      settingsContratos = {
        columns: {
          numContrato: {
            title: "Contrato",
            type: "string",
          },
          descGrupoEmpresas: {
            title: "Grupo de Empresas",
            type: "string"
          },
          vigenciaInicial: {
            title: "Início Vigência",
            type: "string",
            hide: true
          },
          vigenciaFinal: {
            title: "Fim Vigência",
            type: "string"
          }
        },
        actions: null,
        hideSubHeader: true,
        noDataMessage: 'Nenhum contrato finalizando no mês'
      };
    
      settingsPendencias = {
        columns: {
          motivo: {
            title: "Motivo da Pendência",
            type: "string",
          },
          route: {
            title: "route",
            type: "string",            
            hide: true
          },
          action: {
            title: 'Acessar',
            type: 'custom',
            renderComponent: DeleteActionLinkComponent,
            onComponentInitFunction: (instance: DeleteActionLinkComponent) => {
              instance.action.subscribe((row: any) => {
                //this.onAction(row);
              });
            },
          },
        },
        actions: null,
        hideSubHeader: true,
        noDataMessage: 'Nenhum registro encontrado.'
      };
}
