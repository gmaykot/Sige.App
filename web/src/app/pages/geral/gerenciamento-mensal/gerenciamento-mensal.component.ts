import { Component } from '@angular/core';
import { AjudaOperacaoComponent } from '../../../@shared/custom-component/ajuda-operacao/ajuda-operacao.component';
import { NbLayoutScrollService, NbDialogService } from '@nebular/theme';
import { GerenciamentoMensalService } from './gerenciamento-mensal.service';
import { AlertService } from '../../../@core/services/util/alert.service';
import { DateService } from '../../../@core/services/util/date.service';
import { LocalDataSource } from 'ng2-smart-table';
import { GerenciamentoMensalConfigSettings } from './gerenciamento-mensal.config';
import { IResponseInterface } from '../../../@core/data/response.interface';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'ngx-gerenciamento-mensal',
  templateUrl: './gerenciamento-mensal.component.html',
  styleUrls: ['./gerenciamento-mensal.component.scss']
})
export class GerenciamentoMensalComponent extends GerenciamentoMensalConfigSettings {
public selected: any = false;
public loading: any = false;
public pisCofinsSelected: any = false;
public proinfaIcmsSelected: any = false;
public descontoTusdSelected: any = false;
public sourcePisCofins: LocalDataSource = new LocalDataSource();
public sourceProinfaIcms: LocalDataSource = new LocalDataSource();
public sourceDescontoTusd: LocalDataSource = new LocalDataSource();
public bandeiraVigente: any;
public control = this.formBuilder.group({
  // Campos no nível raiz (Informações Gerais)
  mesReferencia: [null],
    // PIS/COFINS
  pisCofins: this.formBuilder.group({
    id: [null],
    concessionariaId: [null],
    descConcessionaria: [null],
    pis: [null],
    cofins: [null],
  }), 
  // Bandeira
  bandeira: this.formBuilder.group({
    id: [null],
    bandeiraTarifariaId: [null],
    bandeira: [null],
  }),
  // Proinfa/ICMS
  proinfaIcms: this.formBuilder.group({
    id: [null],
    pontoMedicaoId: [null],
    descPontoMedicao: [null],
    proinfa: [null],
    icms: [null],
  }),
  // Descontos TUSD
  descontosTusd: this.formBuilder.group({
    id: [null],
    agenteMedicaoId: [null],
    descAgenteMedicao: [null],
    codPerfil: [null],
    descontoTUSD: [null],
  })
});

public mesReferencia: string = '';

  constructor(
    protected service: GerenciamentoMensalService,
    protected formBuilder: FormBuilder,
    protected alertService: AlertService,
    protected scroolService: NbLayoutScrollService,
    protected dialogService: NbDialogService,
    protected dateService: DateService
  ) 
  {
    super();
  }

  async ngOnInit() {
    this.mesReferencia = this.dateService.getMesesReferencia(6)[1].id;
    this.control.patchValue({
      mesReferencia: this.mesReferencia
    });
    await this.loadDadosMensais();
  }

  async loadDadosMensais() {
    this.loading = true;
    this.service.getDadosMensais(this.mesReferencia).then((response: IResponseInterface<any>) => {
      if (response.success) {
        this.sourcePisCofins.load(response.data.pisCofins ?? []);
        this.sourceProinfaIcms.load(response.data.proinfaIcms ?? []);
        this.sourceDescontoTusd.load(response.data.descontoTUSD ?? []);
        this.bandeiraVigente = response.data.bandeiraVigente.bandeira;
        this.control.patchValue({
          bandeira: response.data.bandeiraVigente,
        });
        this.selected = true;
      }
    }).finally(() => {
      this.loading = false;
    });
  }

  getMeses()
  {
    return this.dateService.getMesesReferencia(6);
  }

  onHelp() {
    this.dialogService.open(AjudaOperacaoComponent, { context: { tipoAjuda: 'lancamentos-mensais' } });
  }

  async onSearch($event){
    if ($event == undefined || $event == null) {
      this.selected = false;
      return;
    }

    this.mesReferencia = $event;
    await this.loadDadosMensais()
  }

  onSelectDescontoTusd(event: any) {
    this.descontoTusdSelected = true; 
    this.control.patchValue({
      descontosTusd: event.data
    });
  }

  onSelectPisCofins(event: any) {
    this.pisCofinsSelected = true; 
    this.control.patchValue({
      pisCofins: event.data
    });
  }

  onSelectProinfaIcms(event: any) {   
    this.proinfaIcmsSelected = true; 
    this.control.patchValue({
      proinfaIcms: event.data
    });
  }

  resetFormPisCofins() {
    this.pisCofinsSelected = false;
    this.control.patchValue({
      pisCofins: null
    });
  }

  resetFormProinfaIcms() {
    this.proinfaIcmsSelected = false;
    this.control.patchValue({
      proinfaIcms: null
    });
  }

  resetFormDescontoTusd() {
    this.descontoTusdSelected = false;
    this.control.patchValue({
      descontosTusd: null
    });
  }

  async onSubmitPisCofins() {
    this.loading = true;
    var pisCofins = {
      id: this.control.value.pisCofins?.id,
      concessionariaId: this.control.value.pisCofins?.concessionariaId,
      pis: this.control.value.pisCofins?.pis,
      cofins: this.control.value.pisCofins?.cofins,
      mesReferencia: this.mesReferencia
    } 
    
    await this.service.postPisCofins(pisCofins).then((response: IResponseInterface<any>) => {
      if (response.success) {
        this.alertService.showSuccess('PIS / COFINS cadastrada com sucesso!');
        this.loadDadosMensais();
        this.pisCofinsSelected = false;
        this.resetFormPisCofins();
      }
    }).finally(() => {
      this.loading = false;
    });
  }

  onClosePisCofins() {
    this.pisCofinsSelected = false;
    this.resetFormPisCofins();
  }

  async onSubmitProinfaIcms() {
    this.loading = true;
    var proinfaIcms = {
      id: this.control.value.proinfaIcms?.id,
      descPontoMedicao: this.control.value.proinfaIcms?.descPontoMedicao,
      pontoMedicaoId: this.control.value.proinfaIcms?.pontoMedicaoId,
      proinfa: this.control.value.proinfaIcms?.proinfa,
      icms: this.control.value.proinfaIcms?.icms,
      mesReferencia: this.mesReferencia
    }
    
    await this.service.postProinfaIcms(proinfaIcms).then((response: IResponseInterface<any>) => {
      if (response.success) {
        this.alertService.showSuccess('Proinfa / ICMS cadastrada com sucesso!');
        this.loadDadosMensais();
      } else {
        response.errors.map((x) => this.alertService.showError(x.value));
      }
    })
    .catch((error) => {
      this.alertService.showError(error.message);
    })
    .finally(() => {
      this.loading = false;
      this.proinfaIcmsSelected = false;
      this.resetFormProinfaIcms();
    });
  }

  async onSubmitDescontoTusd() {
    this.loading = true;  
    var descontoTusd = {
      id: this.control.value.descontosTusd?.id,
      descAgenteMedicao: this.control.value.descontosTusd?.descAgenteMedicao,
      agenteMedicaoId: this.control.value.descontosTusd?.agenteMedicaoId,
      codPerfil: this.control.value.descontosTusd?.codPerfil,
      descontoTUSD: this.control.value.descontosTusd?.descontoTUSD,
      mesReferencia: this.mesReferencia
    }
    
    await this.service.postDescontoTusd(descontoTusd).then((response: IResponseInterface<any>) => {
      if (response.success) {
        this.alertService.showSuccess('Desconto TUSD cadastrada com sucesso!');
        this.loadDadosMensais();
      } else {
        response.errors.map((x) => this.alertService.showError(x.value));
      }
    }).catch((error) => {
      this.alertService.showError(error.message);
    }).finally(() => {
      this.loading = false;
      this.descontoTusdSelected = false;
      this.resetFormDescontoTusd();
    });
  }

  onCloseDescontoTusd() {
    this.descontoTusdSelected = false;
    this.resetFormDescontoTusd();
  }

  onCloseProinfaIcms() {
    this.proinfaIcmsSelected = false;
    this.resetFormProinfaIcms();
  }

  async onSubmitBandeiraVigente() {
    this.loading = true;
    var bandeira = {
      id: this.control.value.bandeira?.id,
      bandeira: this.control.value.bandeira?.bandeira,
      bandeiraTarifariaId: this.control.value.bandeira?.bandeiraTarifariaId,
      mesReferencia: this.mesReferencia     
    }

    await this.service.postBandeira(bandeira).then((response: IResponseInterface<any>) => {
      if (response.success) {
        this.alertService.showSuccess('Bandeira vigente cadastrada com sucesso!');
        this.loadDadosMensais();
      } else {
        response.errors.map((x) => this.alertService.showError(x.value));
      }
    }).catch((error) => {
      this.alertService.showError(error.message);
    }).finally(() => {
      this.loading = false;      
    });
  }
}
