import { Component, OnInit } from "@angular/core";
import { RelatorioEconomiaPdfService } from "./relatorio-economia-pdf.service";
import { AlertService } from "../../../@core/services/util/alert.service";
import { LocalDataSource } from "ng2-smart-table";
import { IRelatorioEconomiaList } from "../../../@core/data/gerencial/relatorio-economia";
import { IResponseInterface } from "../../../@core/data/response.interface";
import { FormBuilder, Validators } from "@angular/forms";
import { SessionStorageService } from "../../../@core/services/util/session-storage.service";
import { NbDialogService } from "@nebular/theme";
import { ValidacaoMedicaoComponent } from "../../../@shared/custom-component/validacao-medicao/validacao-medicao/validacao-medicao.component";
import { DateService } from "../../../@core/services/util/date.service";
import { IRelatorioFinal } from "../../../@core/data/geral/relatorio-economia/relatorio-final";
import { settingsRelatorioEconomia } from "../../../@shared/table-config/relatorio-economia.config";
import { EChartsOption } from 'echarts';
import * as echarts from 'echarts';
import { TIPO_CONEXAO } from "../../../@core/enum/status-contrato";
import { AjudaOperacaoComponent } from "../../../@shared/custom-component/ajuda-operacao/ajuda-operacao.component";
import { RelatorioEconomiaService } from "./relatorio-economia.service";

@Component({
  selector: "ngx-relatorio-economia",
  templateUrl: "./relatorio-economia.component.html",
  styleUrls: ["./relatorio-economia.component.scss"],
})
export class RelatorioEconomiaComponent implements OnInit {
  public chartOption: EChartsOption = null;
  chartInstance!: echarts.ECharts;

  onChartInit(chart: echarts.ECharts): void {
    this.chartInstance = chart;
  }
  
  initChart() {
    const cores = ['#d9534f', '#a4cd39', '#3b8de3'];
  
    // Preparar os dados
    const dadosBrutos = this.relatorioFinal.grafico?.linhas?.map((grupo) => ({
      nome: grupo.label,
      valor: grupo.valor,
      cor: cores.shift()
    })) || [];
  
    // Ordenar do maior para o menor
    const dadosOrdenados = [...dadosBrutos].sort((a, b) => b.valor - a.valor);
  
    const categoriasX = dadosOrdenados.map(d => d.nome);
    const valores = dadosOrdenados.map(d => d.valor);
    const coresSeries = dadosOrdenados.map(d => d.cor);
  
    // Configuração do gráfico
    this.chartOption = {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: (params: any) => {
          const val = params[0].value;
          return `${params[0].seriesName}: R$ ${val.toLocaleString('pt-BR', {
            minimumFractionDigits: 2
          })}`;
        }
      },
      legend: {
        show: false // legenda desnecessária, já está nos rótulos
      },
      grid: {
        left: '5%',
        right: '5%',
        bottom: 60,
        top: '10%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: categoriasX,
        axisLabel: {
          fontWeight: 'bold'
        },
        axisTick: { show: false }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: (val: number) => `R$ ${val.toLocaleString('pt-BR')}`
        }
      },
      series: [
        {
          name: 'Valor',
          type: 'bar',
          data: valores,
          barWidth: 40,
          itemStyle: {
            color: (params: any) => coresSeries[params.dataIndex],
            barBorderRadius: [5, 5, 0, 0]
          },
          label: {
            show: true,
            position: 'top',
            fontSize: 12,
            formatter: (params: any) =>
              params.value > 0
                ? `R$ ${params.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                : ''
          }
        }
      ]
    };
  }
  
  

  salvar() {}

  habilitaPdf() {
    return true;
  }

  public getConexao(value: number) {
    return TIPO_CONEXAO.find(f => f.id == value)?.desc;
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
    this.mesReferencia = new Date().toISOString().split("T")[0];
    await this.getRelatorios();
    this.loading = false;
  }

  private async getRelatorios() {
    await this.service
      .getRelatorios(this.mesReferencia)
      .then((response: IResponseInterface<IRelatorioEconomiaList[]>) => {
        if (response.success) {
          this.source.load(response.data);
          response.errors.map((x) => this.alertService.showError(x.value));
        } else {
          this.source.load([]);
        }
      })
      .catch((httpMessage: any) => {
        this.alertService.showError(httpMessage);
      });
  }

  private async getRelatorio() {
    await this.service
      .getFinal(this.relatorioEconomia.pontoMedicaoId, this.mesReferencia)
      .then((response: IResponseInterface<IRelatorioFinal>) => {
        if (response.success && response.status == 200) {
          this.relatorioEconomia.cabecalho = response.data.cabecalho;
          this.relatorioFinal = response.data;
          this.relatorioFinal.grupos.sort((a, b) => a.ordem - b.ordem);
          this.selected = true;
          this.initChart();
          response.errors.map((x) => this.alertService.showWarning(x.value));
        } else {
          response.errors.map((x) => this.alertService.showError(x.value));
        }
      })
      .catch((httpMessage: any) => {
        this.alertService.showError(httpMessage);
      });
  }

  public async downloadAsPdf(): Promise<void> {
    this.alertService.showWarning(
      "Iniciando a geração e download do relatório de economia em PDF.",
      120
    );

    try {
      let graficoImagem = null;

      if (this.chartInstance && this.chartInstance.getDom()) {
        graficoImagem = this.chartInstance.getDataURL({
          type: 'png',
          pixelRatio: 2,
          backgroundColor: '#fff'
        });
      }

      if (this.relatorioFinal) {
      this.relatorioEconomiaPdfService.downloadPDF(this.relatorioFinal, graficoImagem);
    } else {
      const response = await this.service.getFinalPdf(
        this.relatorioEconomia.pontoMedicaoId, 
        this.mesReferencia
      );

      if (response && response.data) {
        response.data.cabecalho = this.relatorioEconomia.cabecalho;
        response.data.grupos.sort((a, b) => a.ordem - b.ordem);
        this.relatorioEconomiaPdfService.downloadPDF(response.data, graficoImagem);
      } else {
        this.alertService.showError("Não foi possível gerar os dados do relatório.");
      }
    }
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    this.alertService.showError("Ocorreu um erro ao gerar o PDF. Tente novamente.");
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

    async onSearch($event: any) {
      this.loading = true;
      this.mesReferencia = $event;
      await this.getRelatorios();
      this.loading = false;
    }

      onHelp() {
        this.dialogService.open(AjudaOperacaoComponent, { context: { tipoAjuda: 'relatorio-economia' } });
      }
}