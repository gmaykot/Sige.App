import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { NbThemeService } from "@nebular/theme";
import { LocalDataSource } from "ng2-smart-table";
import { takeWhile } from "rxjs";
import { IChecklist } from "../../@core/data/administrativo/checklist";
import { IConsumoMeses } from "../../@core/data/administrativo/consumo-meses";
import { IContratosFinalizados } from "../../@core/data/administrativo/contratos-finalizados";
import { IStatusMedicao } from "../../@core/data/administrativo/status-medicao";
import { IResponseInterface } from "../../@core/data/response.interface";
import { STATUS_MEDICAO } from "../../@core/enum/filtro-medicao";
import { DashboardConfigSettings, CardSettings } from "./dashboard.config.settings";
import { DashboardService } from "./dashboard.service";

@Component({
  selector: "ngx-dashboard",
  styleUrls: ["./dashboard.component.scss"],
  templateUrl: "./dashboard.component.html",
})
export class DashboardComponent extends DashboardConfigSettings implements OnDestroy, OnInit {
  public sourceChecklist: LocalDataSource = new LocalDataSource();
  public sourceContratos: LocalDataSource = new LocalDataSource();
  private alive = true;
  public checklist = false;
  public contratos = false;
  public medicoes = false;
  public consumo = false;
  public statusCards: string;
  public mesReferencia: string = new Date().toLocaleString("pt-BR", { month: "numeric", year: "numeric" });
  public mesReferenciaAnterior: string =  new Date(new Date().setMonth(new Date().getMonth() - 1)).toLocaleString("pt-BR", { month: "numeric", year: "numeric" });

  commonStatusCardsSet: CardSettings[] = [
    this.faturamentoCard,
    this.viabilidadeCard,
    this.economiaCard,    
    this.medicaoCard,    
    this.contratoCard
  ];

  statusCardsByThemes: {
    default: CardSettings[];
    corporate: CardSettings[];
  } = {
      default: this.commonStatusCardsSet,
      corporate: this.commonStatusCardsSet
    };

  public pieSource: any[] = [];
  public barSource: any[] = [];

  constructor(
    private themeService: NbThemeService,
    private router: Router,
    private service: DashboardService
  ) {
    super();
  }
  async ngOnInit(): Promise<void> {
    this.themeService
      .getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe((theme) => {
        this.statusCards = this.statusCardsByThemes[theme.name];
      });

    this.service.obterChecklist().then((response: IResponseInterface<IChecklist[]>) => {
      if (response.success) {
        this.sourceChecklist.load(response.data);
      }
      this.checklist = true;
    });
    this.service.obterContratosFinalizados().then((response: IResponseInterface<IContratosFinalizados[]>) => {
      if (response.success) {
        this.sourceContratos.load(response.data);
      }
      this.contratos = true;
    });
    this.service.obterStatusMedicoes().then((response: IResponseInterface<IStatusMedicao[]>) => {
      if (response.success) {        
        this.pieSource = response.data.sort((x, y) => x.status - y.status).map((data) => ({ value: data.total, name: STATUS_MEDICAO.filter(s => s.id == data.status)[0].desc }));
      }
      this.medicoes = true;
    });
    this.service.obterConsumoMeses().then((response: IResponseInterface<IConsumoMeses[]>) => {
      if (response.success) {
        this.barSource = response.data.map((data) => ({ value: data.consumoMensal, name: data.descMes }));
      }
      this.consumo = true;
    });
  }

  ngOnDestroy() {
    this.alive = false;
  }

  onSelectPendencias(event) {
    this.router.navigateByUrl(event.data.route);
  }

}
