import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NbDialogService, NbLayoutScrollService } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';
import { IIntegracaoCCEE, IIntegracaoCCEETotais, IValoresGrafico } from '../../../@core/data/integracao-ccee.response';
import { IColetaMedicao, IMedicao } from '../../../@core/data/medicao';
import { IResponseInterface } from '../../../@core/data/response.interface';
import { CustomDeleteConfirmationComponent } from '../../../@shared/custom-component/custom-delete-confirmation.component';
import { settingsMedicao } from '../../../@shared/table-config/medicoes.config';
import { MedicaoConfigSettings } from '../medicao/medicao.config.settings';
import { DateService } from '../../../@core/services/util/date.service';
import { STATUS_MEDICAO } from '../../../@core/enum/filtro-medicao';
import { AlertService } from '../../../@core/services/util/alert.service';
import { Angular5Csv } from 'angular5-csv/dist/Angular5-csv';
import { HistoricoMedicaoComponent } from '../../../@shared/custom-component/historico-medicao.component';
import { IMedicaoValores } from '../../../@core/data/resultado-medicao';
import { SessionStorageService } from '../../../@core/services/util/session-storage.service';
import { EditMedicaoComponent } from '../../../@shared/custom-component/edit-medicao/edit-medicao.component';
import { MedicaoService } from './medicao.service';

@Component({
  selector: "ngx-medicao",
  templateUrl: "./medicao.component.html",
  styleUrls: ["./medicao.component.scss"],
})
export class MedicaoComponent extends MedicaoConfigSettings implements OnInit {
  public medicoes: Array<IMedicao> = [];
  public settingsMedicao = settingsMedicao;
  public source: LocalDataSource = new LocalDataSource();
  public sourceMedicao: LocalDataSource = new LocalDataSource();
  public sourceMedicaoIcompletas: LocalDataSource = new LocalDataSource();
  public medicaoSelected : IMedicao;
  public loading: boolean = false;
  public coletando: boolean = false;
  public selected: boolean = false;
  public colectAll: boolean = false;
  public periodoMenosUm: string;
  public mesReferencia = null;
  public totais: IIntegracaoCCEETotais;
  public valores: IValoresGrafico[];
  public habilitaOperacoes: boolean = false;
  public percentual: number = 0;

  constructor(
    private formBuilder: FormBuilder,
    private medicaoService: MedicaoService,
    private datePipe: DatePipe,
    private dateService: DateService,
    private dialogService: NbDialogService,
    private alertService: AlertService,
    private scroolService: NbLayoutScrollService
  ) { 
    super(); 
  }

  public control = this.formBuilder.group({
    mesReferencia: ["", Validators.required],
  });

  public controlEdit = this.formBuilder.group({
    id: '',
    icms: [0, Validators.required],
    proinfa: [0, Validators.required],
  });

  async ngOnInit() {
    await this.getMedicoes("", null, "", "");
    this.habilitaOperacoes = SessionStorageService.habilitaOperacoes();
    this.settingsMedicao.actions.delete = SessionStorageService.isSuperUsuario();    
  }

  getMeses()
  {
    return this.dateService.getMesesReferencia(6);
  }

  onSearch(event)
  {
    this.mesReferencia = event;
    this.medicoesChecked = [];
    this.loading = true;
    if (!event || event == '')
      this.source.load(this.medicoes);
    else {
      this.periodoMenosUm = event;
      var periodo = (event && event != '') ? this.datePipe.transform(new Date(event), 'MM') : '';
      this.source.load(this.medicoes.filter(m => !m.periodo || this.datePipe.transform(new Date(m.periodo), 'MM') == periodo))
    }
    this.loading = false;
  }

  async onStatusMedicao()
  {
    await this.getMedicoes("", this.periodoMenosUm, "", "");
    this.medicoesChecked = [];
  }

  async onColectAll(){
    this.colectAll = true;
    this.selected = false;
    this.medicaoSelected = null;
    this.alertService.showWarning('Iniciando coleta de Pontos de Medição EM LOTE. Isso pode levar alguns minutos.', 20000)
    this.medicoesChecked = this.medicoes;
    await this.onColect(null, null);
    this.medicoesChecked = [];
    this.colectAll = false;
  }

  async onColect(medicao, periodo) {
    this.scroolService.scrollTo(0,0);
    var coletaMedicao: IColetaMedicao =
    {
      medicoes: medicao ? [ medicao ] : this.medicoesChecked,
      periodo: periodo ? periodo : this.periodoMenosUm
    }
    this.loading = true;
    this.coletando = true;
    this.sourceMedicao.load([]);
    this.sourceMedicaoIcompletas.load([]);
    var tamanhoDoLote = 15; // Tamanho do lote
    var lotes: IMedicao[][] = []
    
    for (let i = 0; i < coletaMedicao.medicoes.length; i += tamanhoDoLote) {
      const loteAtual = coletaMedicao.medicoes.slice(i, i + tamanhoDoLote);
      lotes.push(loteAtual);
    }
    this.percentual = 2;
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    var erro = false;
    for (let i = 0; i < lotes.length; i += 1) {
      this.percentual = Math.min(Math.round(((i + 1) / lotes.length) * 100), 90);
      var coleta: IColetaMedicao =
      {
        medicoes: lotes[i],
        periodo: coletaMedicao.periodo
      }
      await this.medicaoService
      .coletar(coleta)
      .then(async (response: IResponseInterface<IIntegracaoCCEE>) => {
        if (response.data && response.success && response.data.totais) {
          this.totais = response.data.totais;
          this.valores = response.data.listaValoresGrafico;
          this.sourceMedicao.load(response.data.listaMedidas);
          this.sourceMedicaoIcompletas.load(response.data.listaMedidas.filter(m => m.consumoAtivo === 0 && (m.status === 'HCC' || m.status === 'HE')));
          if (this.medicaoSelected) {
            this.medicaoSelected.statusMedicao = response.data.medicao.statusMedicao;
            await this.selecionarColeta({data: this.medicaoSelected});
          }          
        } else {
          if (medicao)
            response.errors.map((x) => this.alertService.showError(`${x.key} - ${x.value}`));
          erro = true;
        }
      });
    }
    if (erro)
      this.alertService.showWarning('Ocorreu erro em alguma das coletas. Verifique.')
    else
      this.alertService.showSuccess('Coleta efetuada com sucesso.')
    
    this.getMedicoes("", null, "", "");
    this.loading = false;
    this.coletando = false;
    this.medicoesChecked = [];
    this.percentual = 0;
  }

  async salvar()
  {
    var valores = this.controlEdit.value as IMedicaoValores;
    await this.medicaoService
    .postValores(valores)
    .then(async (response: IResponseInterface<any>) => {
      if (response.success) {        
        this.alertService.showSuccess('Valores alterados com sucesso.')
        this.scroolService.scrollTo(0,0);
        this.medicaoSelected.statusMedicao = '1';
        await this.getMedicoes("", null, "", "");
      } else {
        response.errors.map((x) => this.alertService.showError( x.value));
      }
      this.loading = false;
    });    
  }

  private async getMedicoes(
    empresaId: string,
    periodo: string,
    fase: string,
    status: string
  ) {
    await this.medicaoService
      .get(empresaId, periodo, fase, status)
      .then((response: IResponseInterface<IMedicao[]>) => {
        if (response.success) {
          this.medicoes = response.data;
          this.source.load(response.data);
          if (this.medicoes.filter(m => m.statusMedicao == "18").length > 0 && !this.medicaoSelected)
            this.alertService.showWarning("Existem medições Incompletas no período.", 12000)
          if (this.medicoes.filter(m => m.statusMedicao == "19").length > 0 && !this.medicaoSelected)
            this.alertService.showWarning("Existem medições com Valores Divergentes no período.", 12000)
    } else {
          this.source.load([]);
          this.medicoes = [];
          response.errors.map((x) => this.alertService.showError(x.value));
        }
      })
      .catch((httpMessage: any) => {
        httpMessage.error.errors.map((x) => this.alertService.showError( x.value));
      });
  }

  async onPeriodoSelect(event)
  {   
    this.medicoesChecked = [];
    this.loading = true;
    if (!event || event == '')
    {
      await this.getMedicoes("", null, "", "");
    }
    else {
      this.periodoMenosUm = event;
      var periodo = (event && event != '') ? this.datePipe.transform(new Date(event), 'MM') : '';
      this.source.load(this.medicoes.filter(m => !m.periodo || this.datePipe.transform(new Date(m.periodo), 'MM') == periodo))
    }
    this.loading = false;
  }

  getStatusMedicao()
  {   
    return STATUS_MEDICAO.find((f) => f.id == +this.medicaoSelected.statusMedicao)?.desc;
  }

  async selecionarColeta(event) {
    this.medicaoSelected = event?.data as IMedicao;
    this.selected = false;
    if (this.medicaoSelected && this.medicaoSelected.periodo == null)
      {
        this.dialogService
        .open(CustomDeleteConfirmationComponent, { context: { mesage: 'As medições devem ser registradas previamente.', accent: 'warning' } })
        .onClose.subscribe();
      } else
      {
        this.loading = true;
        this.sourceMedicao.load([]);  
        this.sourceMedicaoIcompletas.load([]);
        this.controlEdit = this.formBuilder.group({
          id: this.medicaoSelected?.id,
          icms: this.medicaoSelected?.icms,
          proinfa: this.medicaoSelected.proinfa
        });        
        await this.medicaoService
        .coletarResultado(this.medicaoSelected)
        .then(async (response: IResponseInterface<IIntegracaoCCEE>) => {
          if (response.data && response.success) {
            this.totais = response.data.totais;
            this.valores = response.data.listaValoresGrafico;
            this.sourceMedicao.load(response.data.listaMedidas);
            this.sourceMedicaoIcompletas.load(response.data.listaMedidas.filter(m => m.consumoAtivo === 0 && (m.status === 'HCC' || m.status === 'HE')));
          } else {
          }
          this.selected = true;
          this.loading = false;
        });
      }
    }

    async coletarNovamente()
    {
      await this.onColect(this.medicaoSelected, this.medicaoSelected.periodo);      
    }

    async limparFormulario() {
      this.loading = false;
      this.selected = false;
      this.control.reset();
      this.controlEdit.reset();
    }

    downloadCSV() {
      const options = {
        fieldSeparator: ';',
        quoteStrings: '"',
        decimalseparator: ',',
        showLabels: true,
        headers: [
          'Dia Medição',
          'Ponto de Medição',
          'Sub Tipo',
          'Status',
          'Consumo Ativo',
          'Consumo Reativo'
        ],
      };
      var medicoes = [];
      var nomeArquivo = `medicao_${this.medicaoSelected.descEmpresa.replace(" ", "_")}_${this.datePipe.transform(this.medicaoSelected.periodo, 'yyyyMM')}`.toLowerCase();
      this.sourceMedicao.getAll().then(data => {
        data.forEach(med => {
          medicoes.push({
            periodo: this.datePipe.transform(med.periodo, 'dd/MM/yyyy - HH:mm'),
            pontoMedicao: med.pontoMedicao,
            subTipo: med.subTipo,
            status: med.status,
            consumoAtivo: med.consumoAtivo,
            consumoReativo: med.consumoReativo
          });
        });
        new Angular5Csv(medicoes, nomeArquivo, options);
      });
    }
    
    historicoMedicao()
    {
      this.dialogService
      .open(HistoricoMedicaoComponent, { context: { mesage: 'Deseja realmente excluir os contatos selecionados?'} })
      .onClose.subscribe(async (periodo) => {
        if (periodo){
          var medicao = this.medicaoSelected;
          medicao.periodo = periodo;               
          await this.selecionarColeta({data: medicao});
        }
      });          
    }

    async onDeleteConfirm($event) {
      this.dialogService
        .open(EditMedicaoComponent, { context: { medicao: $event.data } })
        .onClose.subscribe(async (excluir) => {
          // if (excluir) {
          //   await this.valorConcessionariaService
          //     .delete(this.getValor().id)
          //     .then();
          //   {
          //     this.limparFormulario();
          //     this.setSuccessMesage("Valor excluído com sucesso.");
          //     await this.getValoresConcessionarias();
          //   }
          // }
        });
    }
}


