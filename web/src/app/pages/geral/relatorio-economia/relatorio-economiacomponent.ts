import { Component } from "@angular/core";
import { RelatorioEconomiaPdfService } from "./relatorio-economia-pdf.service";
import { AlertService } from "../../../@core/services/util/alert.service";
import { LocalDataSource } from "ng2-smart-table";
import { settingsFatura } from "../../../@shared/table-config/fatura-energia.config";
import { RelatorioMedicaoService } from "../../../@core/services/geral/relatorio-medicao.service";

@Component({
  selector: "ngx-relatorio-economia",
  templateUrl: "./relatorio-economia.component.html",
  styleUrls: ["./relatorio-economia.component.scss"],
})
export class RelatorioEconomiaComponent {
    loading: any;
    getMeses(): any {

    }
    onSelect($event: any) {
        
    }
    onSearch($event: any) {
        
    }
    public settings = settingsFatura;
    public source: LocalDataSource = new LocalDataSource();

  constructor(
    private relatorioEconomiaPdfService: RelatorioEconomiaPdfService,
    private alertService: AlertService,
    private relatorioMedicao: RelatorioMedicaoService
  ) {}

  public async downloadAsPdf(): Promise<void> {
    this.alertService.showWarning(
      "Iniciando a geração e download do relatório de economia em PDF.",
      120
    );
    await this.relatorioMedicao.getFinal().then(r => {
      console.log(r.data);
      this.relatorioEconomiaPdfService.downloadPDF(r.data);
    });
  }
}
