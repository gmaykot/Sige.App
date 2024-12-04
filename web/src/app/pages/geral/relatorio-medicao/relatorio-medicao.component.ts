import { Component, OnInit } from '@angular/core';
import { settingsRelatorioMedicao, settingsResultadoAnalitico, settingsResultadoEconomia } from '../../../@shared/table-config/relatorio-economia.config';
import { LocalDataSource } from 'ng2-smart-table';
import { DateService } from '../../../@core/services/util/date.service';
import { FormBuilder } from '@angular/forms';
import { RelatorioMedicaoService } from '../../../@core/services/geral/relatorio-medicao.service';
import { ContatoService } from '../../../@core/services/gerencial/contato.service';
import { DatePipe } from '@angular/common';
import { NbDialogService, NbGlobalPhysicalPosition } from '@nebular/theme';
import { IResponseInterface } from '../../../@core/data/response.interface';
import { CalculoEconomiaService } from '../../../@core/services/geral/calculo-medicao.service';
import { EmailService } from '../../../@core/services/util/email.service';
import { CustomDeleteConfirmationComponent } from '../../../@shared/custom-component/custom-delete-confirmation.component';
import { FASES_MEDICAO } from '../../../@core/enum/filtro-medicao';
import { IContatoEmail, IEmailData } from '../../../@core/data/email-data';
import { EnvioEmailComponent } from '../../../@shared/custom-component/envio-email/envio-email.component';
import { IContato } from '../../../@core/data/contato';
import { RelatorioMedicaoPdfService } from './relatorio-medicao-pdf.service';
import { AlertService } from '../../../@core/services/util/alert.service';
import { IRelatorioMedicao, IRelatorioMedicaoList, IRelatorioMedicaoRequest, IValoresMedicao, IValoresMedicaoAnalitico } from '../../../@core/data/relatorio-medicao';
import { ValidacaoMedicaoComponent } from '../../../@shared/custom-component/validacao-medicao/validacao-medicao/validacao-medicao.component';
import { SessionStorageService } from '../../../@core/services/util/session-storage.service';
import { MedicaoService } from '../../../@core/services/geral/medicao.service';
import { Angular5Csv } from 'angular5-csv/dist/Angular5-csv';

@Component({
  selector: 'ngx-relatorio-medicao',
  templateUrl: './relatorio-medicao.component.html',
  styleUrls: ['./relatorio-medicao.component.scss']
})
export class RelatorioMedicaoComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private relatorioEconomiaService: RelatorioMedicaoService,
    private medicaoService: MedicaoService,
    private contatoService: ContatoService,
    private datePipe: DatePipe,
    private dialogService: NbDialogService,
    private dateService: DateService,
    private calculoEconomiaService: CalculoEconomiaService,
    private emailService: EmailService,
    private relatorioMedicaoPdfService: RelatorioMedicaoPdfService,
    private alertService: AlertService,
  ) {}

    public settings = settingsRelatorioMedicao;
    public settingsResultado = settingsResultadoEconomia;
    public settingsResultadoAnalitico = settingsResultadoAnalitico;
    public source: LocalDataSource = new LocalDataSource();
    public sourceResultado: LocalDataSource = new LocalDataSource();
    public sourceResultadoAnalitico: LocalDataSource = new LocalDataSource();

    public selected: boolean = false;
    public loading: boolean = false;

    public dataAtual = new Date();
    public mesReferencia = null;
    public relatorio: IRelatorioMedicaoList;
    public relatorioMedicao: IRelatorioMedicao;
    public valores:IValoresMedicao;
    public resultadoAnalitico: IValoresMedicaoAnalitico[];
    public contatos: Array<IContato> = []
    public positions = NbGlobalPhysicalPosition;
    public habilitaValidar: boolean = false;
    public habilitaOperacoes: boolean = false;

    public control = this.formBuilder.group({
    });

    async ngOnInit()
    {
      this.loading = true;
      await this.getRelatorios();
      this.loading = false;      
      this.habilitaValidar = SessionStorageService.habilitaValidarRelatorio();
      this.habilitaOperacoes = SessionStorageService.habilitaOperacoes();
    }
  
  validar()
  {
    this.dialogService
    .open(ValidacaoMedicaoComponent)
    .onClose.subscribe(async (ret) => {
    }); 
  }

  clear()
  {
    this.mesReferencia = null;
    this.selected = false;
    this.sourceResultado.load([]);
    this.sourceResultadoAnalitico.load([]);
    this.relatorioMedicao = null;
  }

  getMeses()
  {
    return this.dateService.getCompetencias(6);
  }

  onSearch(event)
  {
    this.mesReferencia = event;
  }

  async onSelect(event)
  {
    this.loading = true;
    this.relatorio = event.data as IRelatorioMedicaoList;
    if (this.mesReferencia == null) {
      this.dialogService
        .open(CustomDeleteConfirmationComponent, {
          context: {
            mesage: "O Mês de Referência do Relatório deve ser selecionado.",
            accent: "warning",
          },
        })
        .onClose.subscribe();
    } else {
      await this.relatorioEconomiaService
      .getRelatorio(this.relatorio.contratoId, this.mesReferencia)
      .then((response: IResponseInterface<IRelatorioMedicao>) => {
        if (response.success) {
          this.relatorioMedicao = response.data;
          this.atualizaValoresEconomia();
          this.selected = true;
        } else {
          this.relatorioMedicao = null;
          response.errors.map((x) => this.alertService.showError(x.value));
        }
      })
      .catch((httpMessage: any) => {
        this.alertService.showError(httpMessage);
      });
    }
    this.loading = false;
  }

  atualizaValoresEconomia(){
    this.valores = this.calculoEconomiaService.calcular(this.relatorioMedicao);
    this.sourceResultado.load([this.valores.resultadoFaturamento]);
    
    this.resultadoAnalitico = this.calculoEconomiaService.calcularAnalitico(this.relatorioMedicao);
    this.sourceResultadoAnalitico.load(this.resultadoAnalitico);
        
    if (this.valores.comprarCurtoPrazo > 0)
      this.settingsResultadoAnalitico.columns.comprarCurtoPrazo.hide = false;
    if (this.valores.venderCurtoPrazo > 0)
      this.settingsResultadoAnalitico.columns.venderCurtoPrazo.hide = false;
  }

  getStatusFase()
  {   
    return FASES_MEDICAO.find((f) => f.id == +this.relatorioMedicao.fase)?.desc;
  }

  private async getRelatorios() {
    var relatorio: IRelatorioMedicaoRequest = {
    };
    await this.relatorioEconomiaService
      .getRelatorios(relatorio)
      .then((response: IResponseInterface<IRelatorioMedicaoList[]>) => {
        if (response.success) {
          this.source.load(response.data);
        } else {
          this.source.load([]);
        }
      })
      .catch((httpMessage: any) => {
        this.alertService.showError("Não foi possível conectar ao servidor.");
      });
  }
  
  private async getContatos(idFornecedor: string) {
    await this.contatoService
    .getPorFornecedor(idFornecedor)
    .then((response: IResponseInterface<IContato[]>) => {
      if (response.success) {
        this.contatos = response.data
      } else {
        this.contatos = [];
        response.errors.map((x) => this.alertService.showError(x.value));
      }
    })
    .catch((httpMessage: any) => {
      this.alertService.showError(httpMessage);
    });
  }

  public downloadAsPdf(): void {
    this.alertService.showWarning("Iniciando a geração e download do relatório de medição em PDF.")
    this.relatorioMedicaoPdfService.downloadPDF(this.relatorioMedicao, this.valores, this.resultadoAnalitico, this.mesReferencia);
  }

  public downloadAsCsv(): void {
    const options = {
      fieldSeparator: ';',
      quoteStrings: '"',
      decimalseparator: ',',
      showLabels: true,
      headers: [
        'Empresa',
        'Dia Medição',
        'Agente Medição',
        'Ponto Medição',
        'Sub Tipo',
        'Status',
        'Consumo Ativo',
        'Consumo Reativo',
      ],
    };
    var nomeArquivo = `relarotio_medicao${this.relatorioMedicao.descGrupo.replace(" ", "_")}_${this.datePipe.transform(this.mesReferencia, 'yyyyMM')}`.toLowerCase();
    var medicoes = [];
    this.medicaoService
    .medicaoPorContrato(this.relatorioMedicao.contratoId, this.relatorioMedicao.mesReferencia || this.mesReferencia)
    .then((response: IResponseInterface<any>) => {
      if (response.success) {
        response.data.forEach(med => {
          medicoes.push({
            descEmpresa: med.descEmpresa,
            diaMedicaoo: this.datePipe.transform(med.diaMedicaoo, 'dd/MM/yyyy - HH:mm'),
            descAgenteMedicao: med.descAgenteMedicao,
            descPontoMedicao: med.descPontoMedicao,
            status: med.status,
            totalConsumoAtivo: med.totalConsumoAtivo,
            totalConsumoReativo: med.totalConsumoReativo,
          });
        });
        new Angular5Csv(medicoes, nomeArquivo, options);
      } else {
        response.errors.map((x) => this.alertService.showError(x.value));
      }
    })
    .catch((httpMessage: any) => {
      this.alertService.showError(httpMessage);
    });
  }

  async onSendEmail()
  {
    this.loading = true;
    var contatosSend: IContatoEmail[] = [] 
    await this.getContatos(this.relatorio.fornecedorId);
    this.contatos.map(c => contatosSend.push({ emailContato: c.email, nomeContato: c.nome, tipoFornecedor: true , id: null}));
    this.loading = false;
    this.dialogService
    .open(EnvioEmailComponent, { context: { contatos: contatosSend } })
    .onClose.subscribe(async (contatos) => {
      if (contatos && contatos.length > 0){    
        contatosSend = []          
        contatos.forEach(c => {
          contatosSend.push(c as IContatoEmail)
        });
        this.alertService.showWarning("Iniciando a geração e envio do relatório de medição em PDF por e-mail.")
        this.sendEmailAsPdf(contatosSend);
      }
    });          
  }

  public sendEmailAsPdf(contatosSend: IContatoEmail[]): void {       
        var file = this.relatorioMedicaoPdfService.blobPDF(this.relatorioMedicao, this.valores, this.resultadoAnalitico, this.mesReferencia);
        this.blobToBase64(file).then(async (result: string) =>
        {
          if (result){
            var contato: IContatoEmail = contatosSend.filter(c => c.tipoFornecedor == true).pop();
            if (!contato || contato == null)
              contato = contatosSend.pop();
            
            var emailData: IEmailData = {
              contratoId: this.relatorioMedicao.contratoId,
              contato: contato,
              mesReferencia: this.datePipe.transform(this.mesReferencia, "MM/yyyy"),
              descMesReferencia: this.datePipe.transform(this.mesReferencia, "MMyy"),
              descEmpresa: this.relatorioMedicao.descGrupo,
              totalNota: Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(this.relatorioMedicao.totalMedido),
              relatorios: [result],
              contatosCCO: contatosSend.filter(c => c.id != contato.id)
            }
            await this.emailService.sendEmail(emailData).then(() => this.alertService.showSuccess('Email enviado com sucesso.'));
          }
        });
  }

  blobToBase64(blob) {
    return new Promise((resolve, _) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  }
}