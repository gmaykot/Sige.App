import { Component } from "@angular/core";
import { RelatorioEconomiaPdfService } from "./relatorio-economia-pdf.service";
import { AlertService } from "../../../@core/services/util/alert.service";

@Component({
  selector: "ngx-relatorio-economia",
  templateUrl: "./relatorio-economia.component.html",
  styleUrls: ["./relatorio-economia.component.scss"],
})
export class RelatorioEconomiaComponent {
  constructor(
    private relatorioEconomiaPdfService: RelatorioEconomiaPdfService,
    private alertService: AlertService
  ) {}

  public downloadAsPdf(): void {
    this.alertService.showWarning(
      "Iniciando a geração e download do relatório de economia em PDF.",
      120
    );
    this.relatorioEconomiaPdfService.downloadPDF();
  }
}
