import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NbDialogService, NbLayoutScrollService, NbTabsetComponent } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';
import { AlertService } from '../../../@core/services/util/alert.service';
import { SessionStorageService } from '../../../@core/services/util/session-storage.service';
import { EnergiaAcumuladaConfigSettings } from './energia-acumulada.config.settings';
import { IDropDown } from '../../../@core/data/drop-down';
import { PontoMedicaoService } from '../../../@core/services/gerencial/ponto-medicao.service';
import { IResponseInterface } from '../../../@core/data/response.interface';
import { EnergiaAcumuladaService } from '../../../@core/services/gerencial/energia-acumulada.service';
import { IEnergiaAcumulada } from '../../../@core/data/gerencial/energia-acumulada';
import { ViewChild } from '@angular/core';
import { CustomDeleteConfirmationComponent } from '../../../@shared/custom-component/custom-delete-confirmation.component';

@Component({
  selector: 'ngx-energia-acumulada',
  templateUrl: './energia-acumulada.component.html',
  styleUrls: ['./energia-acumulada.component.scss']
})
export class EnergiaAcumuladaComponent extends EnergiaAcumuladaConfigSettings implements OnInit{
  @ViewChild(NbTabsetComponent) tabset!: NbTabsetComponent;

  public source: LocalDataSource = new LocalDataSource();
  public sourceHistorico: LocalDataSource = new LocalDataSource();
  public loading: boolean;
  public edit: boolean;
  public selected: boolean;
  public habilitaOperacoes: boolean = false;
  public pontosMedicao: Array<IDropDown> = [];
  public energiaAcumulada: IEnergiaAcumulada = null;

  constructor(
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private dialogService: NbDialogService,
    private scroolService: NbLayoutScrollService,
    private pontoMedicaoService: PontoMedicaoService,
    private energiaAcumuladaService: EnergiaAcumuladaService
  ) { super(); }
  
  public control = this.formBuilder.group({
    id: [''],
    pontoMedicaoId: [''],
    mesReferencia: [''],
    ValorMensalAcumulado: [0, Validators.required],
    ValorTotalAcumulado: [0, Validators.required],
  });

  async ngOnInit() {
    this.limparFormulario();
    this.habilitaOperacoes = SessionStorageService.habilitaOperacoes();
    await this.getPontosMedicao();
    await this.getEnergiasAcumuladas();
  }

  onSelect(event): void {
    this.limparFormulario();
    this.energiaAcumulada = event.data as IEnergiaAcumulada;
    this.control = this.formBuilder.group({
      id: [this.energiaAcumulada.id],
      pontoMedicaoId: [this.energiaAcumulada.pontoMedicaoId],
      mesReferencia: [this.energiaAcumulada.mesReferencia],
      ValorMensalAcumulado: [this.energiaAcumulada.valorMensalAcumulado],
      ValorTotalAcumulado: [this.energiaAcumulada.valorTotalAcumulado],
    });
    this.edit = true;
    this.selected = true;
    this.scroolService.scrollTo(0,0);  
    this.tabset?.selectTab(this.tabset.tabs.toArray()[0]);

    this.loadHistorico(this.energiaAcumulada.pontoMedicaoId);
  }

  async getEnergiasAcumuladas() {
    this.loading = true;
    await this.energiaAcumuladaService
      .getPorMesReferencia()
      .then((response: IResponseInterface<IEnergiaAcumulada[]>) => {        
        if (response.success) {
          this.source.load(response.data);
        } else {
          this.alertService.showError(response.message, 20000)
          this.source.load([]);
        }
      })
      .finally(() => {
        this.loading = false;
      });
  }

  async getPontosMedicao() {
    this.loading = true;
    await this.pontoMedicaoService
      .getDropDownComSegmento()
      .then((response: IResponseInterface<IDropDown[]>) => {        
        if (response.success) {
          this.pontosMedicao = response.data;
        } else {
          this.alertService.showError(response.message, 20000)
          this.source.load([]);
        }
      })
      .finally(() => {
        this.loading = false;
      });
  }

  onEdit() {
    this.edit = !this.edit;
  }

  async onDeleteConfirm() {
      this.dialogService
      .open(CustomDeleteConfirmationComponent, { context: { mesage: 'Deseja realmente excluir a energia acumulada?'} })
      .onClose.subscribe(async (excluir) => {
        if (excluir){
          this.loading = true;
          await this.energiaAcumuladaService
          .delete(this.energiaAcumulada.id)
          .then(async (response: IResponseInterface<IEnergiaAcumulada>) => {        
            if (response.success) {
              this.alertService.showSuccess(response.message, 20000)
              await this.getEnergiasAcumuladas();
            } else {
              this.alertService.showError(response.message, 20000)
            }
          })
          .finally(() => {
            this.limparFormulario();
            this.loading = false;
          });
        }
      });     
  }

  async onSubmit() {
    this.loading = true;
    const dados = this.control.value;
  
    const operacao = dados.id ? this.energiaAcumuladaService.put(dados) : this.energiaAcumuladaService.post(dados);  
    await operacao
      .then(async (response: IResponseInterface<IEnergiaAcumulada>) => {
        if (response.success) {
          this.alertService.showSuccess(response.message, 20000);
          this.energiaAcumulada = response.data;
          this.energiaAcumulada.pontoMedicaoDesc = this.pontosMedicao.find(x => x.id === response.data.pontoMedicaoId).descricao;
          await this.getEnergiasAcumuladas();
          this.selected = true;
          this.loadHistorico(this.energiaAcumulada.pontoMedicaoId);
        } else {
          response.errors.map((x) => this.alertService.showError(`${x.value}`));
        }
      })
      .finally(() => {
        this.loading = false;
      });
  }

  async onItemSelected(event: IDropDown) {
    this.loading = true;
    await this.loadHistorico(event.id);
    this.energiaAcumulada = { pontoMedicaoId: event.id, pontoMedicaoDesc: event.descricao };
    this.control.patchValue({
      pontoMedicaoId: event.id,
    });
  }

  async loadHistorico(pontoMedicaoId: string) {
    this.loading = true;
    await this.energiaAcumuladaService
      .getPorPontoMedicao(pontoMedicaoId)
      .then((response: IResponseInterface<IEnergiaAcumulada[]>) => {        
        if (response.success) {
          this.sourceHistorico.load(response.data);
        } else {
          this.alertService.showError(response.message, 20000)
          this.sourceHistorico.load([]);
        }
      })
      .finally(() => {
        this.loading = false;
      });
  }

  onCreate() {
    this.selected = false;
    this.control.patchValue({
      id: '',
      mesReferencia: '',
      ValorMensalAcumulado: 0,
      ValorTotalAcumulado: 0,
    });

  }

  limparFormulario(): void {
    this.control.reset();
    this.edit = false;
    this.selected = false;
    this.energiaAcumulada = null;
    this.sourceHistorico.load([]);
  }

  carregarHistorico() {
    return this.sourceHistorico.count() > 0;
  }
}
