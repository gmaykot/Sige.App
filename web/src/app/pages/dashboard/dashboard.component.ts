import { Component, OnDestroy, OnInit } from "@angular/core";
import { NbThemeService } from "@nebular/theme";
import { takeWhile } from "rxjs/operators";
import { DeviceDetectorService } from "ngx-device-detector";
import { ActivatedRoute, Router } from "@angular/router";
import { LocalDataSource } from "ng2-smart-table";

interface CardSettings {
  title: string;
  iconClass: string;
  type: string;
  link: string;
}

@Component({
  selector: "ngx-dashboard",
  styleUrls: ["./dashboard.component.scss"],
  templateUrl: "./dashboard.component.html",
})
export class DashboardComponent implements OnDestroy, OnInit {
  public sourcePendencias: LocalDataSource = new LocalDataSource();
  public sourceContratos: LocalDataSource = new LocalDataSource();
  private alive = true;
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

  settingsContratos = {
    delete: {
      deleteButtonContent: '<i class="nb-checkmark"></i>',
      confirmDelete: true,
    },
    columns: {
      numContrato: {
        title: "Número Contrato",
        type: "string",
        class: "action",
      },
      descGrupo: {
        title: "Grupo de Empresas",
        type: "string",
        class: "action",
      },
      vigenciaInicial: {
        title: "Início de Vigência",
        type: "string",
        class: "action",
      }
    },
    actions: {
      columnTitle: '',
      add: false,
      edit: false,
      delete: false,
      position: "right",
    },
    hideSubHeader: true,
    noDataMessage: 'Nenhum registro encontrado.'
  };

  settingsPendencias = {
    delete: {
      deleteButtonContent: '<i class="nb-checkmark"></i>',
      confirmDelete: true,
    },
    columns: {
      motivo: {
        title: "Motivo da Pendência",
        type: "string",
        class: "action",
      },
      route: {
        title: "route",
        type: "string",
        class: "action",
        hide: true
      }
    },
    actions: {
      columnTitle: 'Acessar',
      add: false,
      edit: false,
      delete: true,
      position: "right",
    },
    hideSubHeader: true,
    noDataMessage: 'Nenhum registro encontrado.'
  };

  statusCards: string;

  commonStatusCardsSet: CardSettings[] = [
    this.viabilidadeCard,
    this.economiaCard,
    this.contratoCard
  ];

  statusCardsByThemes: {
    default: CardSettings[];
    corporate: CardSettings[];
  } = {
    default: this.commonStatusCardsSet,
    corporate: this.commonStatusCardsSet
  };

  constructor(
    private themeService: NbThemeService,
    private router: Router
  ) {
      
    this.themeService
      .getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe((theme) => {
        this.statusCards = this.statusCardsByThemes[theme.name];
      });
  }
  ngOnInit(): void {
    this.sourcePendencias.load([{ motivo: 'Cadastro de bandeira tarifária vigente', route: '/pages/bandeira-tarifaria' }, { motivo: 'Geração de medições', route: '/pages/medicao' }, { motivo: 'Cadastro de Faturamento Coenel.', route: '/pages/faturamento-coenel' }]);
    this.sourceContratos.load([{ numContrato: '765.23', descGrupo: 'POMZAN MOVEIS', vigenciaInicial: '12/2022' }]);
  }

  ngOnDestroy() {
    this.alive = false;
  }

  onSelectPendencias(event){
    this.router.navigateByUrl(event.data.route);
  }
}
