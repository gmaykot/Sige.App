import { Component, OnInit } from "@angular/core";
import { RelatorioEconomiaPdfService } from "./relatorio-economia-pdf.service";
import { AlertService } from "../../../@core/services/util/alert.service";
import { LocalDataSource } from "ng2-smart-table";
import { RelatorioEconomiaService } from "../../../@core/services/geral/relatorio-economia.service";
import { IRelatorioEconomiaList } from "../../../@core/data/gerencial/relatorio-economia";
import { IResponseInterface } from "../../../@core/data/response.interface";
import { FormBuilder, Validators } from "@angular/forms";
import { SessionStorageService } from "../../../@core/services/util/session-storage.service";
import { NbDialogService } from "@nebular/theme";
import { ValidacaoMedicaoComponent } from "../../../@shared/custom-component/validacao-medicao/validacao-medicao/validacao-medicao.component";
import { DateService } from "../../../@core/services/util/date.service";
import { IRelatorioFinal } from "../../../@core/data/geral/relatorio-economia/relatorio-final";
import { settingsRelatorioEconomia } from "../../../@shared/table-config/relatorio-economia.config";
@Component({
  selector: "ngx-relatorio-economia",
  templateUrl: "./relatorio-economia.component.html",
  styleUrls: ["./relatorio-economia.component.scss"],
})
export class RelatorioEconomiaComponent implements OnInit {
  onSearch($event: any) {}
  salvar() {}

  habilitaPdf() {
    return true;
  }

  public settings = settingsRelatorioEconomia;
  public source: LocalDataSource = new LocalDataSource();
  public selected: boolean = false;
  public loading: boolean = false;
  public relatorioEconomia: any;
  public relatorioFinal: any;
  public mesReferencia: any;
  public habilitaValidar: boolean = false;
  public habilitaOperacoes: boolean = false;

  constructor(
    private relatorioEconomiaPdfService: RelatorioEconomiaPdfService,
    private service: RelatorioEconomiaService,
    private alertService: AlertService,
    private relatorioService: RelatorioEconomiaService,
    private formBuilder: FormBuilder,
    private dialogService: NbDialogService,
    private dateService: DateService
  ) {}

  public control = this.formBuilder.group({
    observacao: ["", Validators.required],
    observacaoValidacao: [null, null],
    validado: [null, null],
    usuarioResponsavelId: [SessionStorageService.getUsuarioId(), null],
  });

  async ngOnInit() {
    this.habilitaValidar = SessionStorageService.habilitaValidarRelatorio();
    this.habilitaOperacoes = SessionStorageService.habilitaOperacoes();
    this.loading = true;
    await this.getRelatorios();
    this.loading = false;
  }

  private async getRelatorios() {
    await this.service
      .getRelatorios(this.mesReferencia)
      .then((response: IResponseInterface<IRelatorioEconomiaList[]>) => {
        if (response.success) {
          this.source.load(response.data);
        } else {
          this.source.load([]);
        }
      })
      .catch((httpMessage: any) => {
        this.alertService.showError("Não foi possível conectar ao servidor.");
        console.error('Erro ao gerar relatório', {
          metodo: 'getRelatorios',
          pontoMedicaoId: this.relatorioEconomia.pontoMedicaoId,
          mesReferencia: this.mesReferencia,
          httpMessage: httpMessage
        });
      });
  }

  private async getRelatorio() {
    await this.service
      .getFinal(this.relatorioEconomia.pontoMedicaoId, this.mesReferencia)
      .then((response: IResponseInterface<IRelatorioFinal>) => {
        if (response.success) {
          this.relatorioEconomia.cabecalho = response.data.cabecalho;
          this.relatorioFinal = response.data;
          this.relatorioFinal.grupos.sort((a, b) => a.ordem - b.ordem);
          this.selected = true;
        } else {
          
        }
      })
      .catch((httpMessage: any) => {
        this.alertService.showError("Não foi possível conectar ao servidor.");
        console.error('Erro ao gerar relatório', {
          metodo: 'getRelatorio',
          pontoMedicaoId: this.relatorioEconomia.pontoMedicaoId,
          mesReferencia: this.mesReferencia,
          httpMessage: httpMessage
        });
      });
  }

  public async downloadAsPdf(): Promise<void> {
    this.alertService.showWarning(
      "Iniciando a geração e download do relatório de economia em PDF.",
      120
    );
    if (this.relatorioFinal) {
      this.relatorioEconomiaPdfService.downloadPDF(this.relatorioFinal);
    } else {
      await this.relatorioService.getFinalPdf(this.relatorioEconomia.pontoMedicaoId, this.mesReferencia).then((r) => {
        r.data.cabecalho = this.relatorioEconomia.cabecalho;
        r.data.grupos.sort((a, b) => a.ordem - b.ordem);
        this.relatorioEconomiaPdfService.downloadPDF(r.data);
      });
    }
  }

  clear() {
    this.mesReferencia = null;
    this.selected = false;
    this.relatorioEconomia = null;
  }

  async onSelect($event: any) {
    this.loading = true;
    this.relatorioEconomia = $event.data;
    this.mesReferencia = this.relatorioEconomia.mesReferencia;
    await this.getRelatorio();
    this.loading = false;
  }

  validar()
    {
      this.dialogService
      .open(ValidacaoMedicaoComponent, { context: { observacao: this.relatorioEconomia.observacaoValidacao, validado: this.relatorioEconomia.validado, tipoRelatorio: 'Economia' } })
      .onClose.subscribe(async (ret) => {
        if (ret) {
          this.control.patchValue({ observacaoValidacao: ret.observacao }, { emitEvent: false });
          this.control.patchValue({ validado: ret.validado }, { emitEvent: false });
          this.salvar();
        }
      }); 
    }

    getMeses()
    {
      return this.dateService.getMesesReferencia(6);
    }

    getTipo(tipo: number, valor: number)
    {
      if (!valor || valor == 0)
        return '';
      
      switch (tipo) {
        case 0:
          return 'MWh';
        case 1:
          return 'kW';
        case 2:
          return 'kWh';
        case 3:
          return '%';
        default:
          return '';
      }
    }
}