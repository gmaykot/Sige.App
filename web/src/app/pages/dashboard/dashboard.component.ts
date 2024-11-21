import { Component, OnDestroy } from "@angular/core";
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
export class DashboardComponent implements OnDestroy {
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

  settings = {
    delete: {
      deleteButtonContent: '<i class="nb-gear"></i>',
      confirmDelete: true,
    },
    columns: {
      mesReferencia: {
        title: "Mês Referência",
        type: "string"
      },
      empresa: {
        title: "Empresa",
        type: "string",
      },
      totalkWh: {
        title: "Total kW/h",
        type: "string",
      },
      mediakWh: {
        title: "Média kW/h",
        type: "string",
      }
    },
    actions: {
      columnTitle: 'Medir',
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
    private deviceService: DeviceDetectorService,
    private router: ActivatedRoute
  ) {
   
    this.router.url.subscribe(url => {
      var currentRoute = url.join('/');
    });
    
    this.themeService
      .getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe((theme) => {
        this.statusCards = this.statusCardsByThemes[theme.name];
      });
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
