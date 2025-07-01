import { AfterViewInit, Component, OnInit } from "@angular/core";
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
import { EChartsOption } from 'echarts';
import * as echarts from 'echarts';
import { TIPO_CONEXAO } from "../../../@core/enum/status-contrato";
import { AjudaOperacaoComponent } from "../../../@shared/custom-component/ajuda-operacao/ajuda-operacao.component";
import { LocalizacaoService } from "../../../@core/services/localizacao.service";

@Component({
  selector: "ngx-relatorio-economia",
  templateUrl: "./relatorio-economia.component.html",
  styleUrls: ["./relatorio-economia.component.scss"],
})
export class RelatorioEconomiaComponent implements OnInit, AfterViewInit  {
  public chartOption: EChartsOption = null;
  chartInstance!: echarts.ECharts;

  onChartInit(chart: echarts.ECharts): void {
    this.chartInstance = chart;
  }

  ngAfterViewInit(): void {
    
  }
  
  initChart() {
    // Dados brutos
    const cores = ['#d9534f', '#a4cd39', '#3b8de3'];
    const dadosBrutos = this.relatorioFinal.grafico?.linhas?.map((grupo) => ({
      nome: grupo.label,
      valor: grupo.valor,
      cor: cores.shift()
    }));
  
    // Ordenar do maior para o menor
    const dadosOrdenados = [...dadosBrutos].sort((a, b) => a.valor - b.valor);
  
    // Construir os dados do gráfico
    const categoriasY = dadosOrdenados.map((_, idx) => `cat${idx}`);
    const legendas = dadosOrdenados.map(d => d.nome);
  
    const series = dadosOrdenados.map((dado, index) => {
      const dataArray = new Array(dadosOrdenados.length).fill(0);
      dataArray[index] = dado.valor;
    
      return {
        name: dado.nome,
        type: 'bar',
        data: dataArray,
        barWidth: 20,
        barGap: '25%',
        barCategoryGap: '50%',
        itemStyle: {
          color: dado.cor,
          barBorderRadius: [0, 5, 5, 0]
        },
        label: {
          show: true,
          position: 'right',
          color: dado.cor,
          fontSize: 18,
          formatter: (params: any) =>
            params.value > 0
              ? `R$ ${params.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
              : ''
        }
      };
    })
  
    // Configuração final
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
        orient: 'horizontal',
        bottom: 0,
        data: legendas,
        textStyle: {
          fontWeight: 'bold'
        }
      },
      grid: {
        left: '5%',
        right: '10%',
        bottom: 60,
        top: '10%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        axisLabel: {
          formatter: (val: number) => `R$ ${val.toLocaleString('pt-BR')}`
        }
      },
      yAxis: {
        type: 'category',
        data: categoriasY,
        axisLabel: { show: false },
        axisLine: { show: false },
        axisTick: { show: false }
      },
      series
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
    private relatorioService: RelatorioEconomiaService,
    private formBuilder: FormBuilder,
    private dialogService: NbDialogService,
    private dateService: DateService,
    private localizacaoService: LocalizacaoService
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
    try {
      console.log(await this.localizacaoService.obterLocalizacaoFormatada());
    } catch (erro) {
      console.log('Não foi possível obter a localização.');
    }
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
        if (response.success) {
          this.relatorioEconomia.cabecalho = response.data.cabecalho;
          this.relatorioFinal = response.data;
          this.relatorioFinal.grupos.sort((a, b) => a.ordem - b.ordem);
          this.selected = true;
          this.initChart();
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
      const response = await this.relatorioService.getFinalPdf(
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