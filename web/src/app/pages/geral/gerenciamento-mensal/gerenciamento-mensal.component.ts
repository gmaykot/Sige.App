import { Component } from '@angular/core';
import { AjudaOperacaoComponent } from '../../../@shared/custom-component/ajuda-operacao/ajuda-operacao.component';
import { NbLayoutScrollService, NbDialogService } from '@nebular/theme';
import { GerenciamentoMensalService } from '../../../@core/services/geral/gerenciamento-mensal.service';
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
public sourcePisCofins: LocalDataSource = new LocalDataSource();
public sourceProinfaIcms: LocalDataSource = new LocalDataSource();
public bandeiraVigente: any;
public control =  this.formBuilder.group({
    bandeiraId: [null],
    bandeiraTarifariaId: [null],
    impostoId: [null],
    pis: [null],
    cofins: [null],
    proinfa: [null],
    icms: [null],
    bandeiraVigente: [null],
    descConcessionaria: [null],
    concessionariaId: [null],
    descPontoMedicao: [null],
    mesReferencia: [null]
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
    
  }

  async loadDadosMensais() {
    this.loading = true;
    this.service.getDadosMensais(this.mesReferencia).then((response: IResponseInterface<any>) => {
      if (response.success) {
        this.sourcePisCofins.load(response.data.pisCofins ?? []);
        this.sourceProinfaIcms.load(response.data.proinfaIcms ?? []);
        this.bandeiraVigente = response.data.bandeiraVigente.bandeira;
        this.control.patchValue({
          bandeiraVigente: response.data.bandeiraVigente.bandeira,
          bandeiraId: response.data.bandeiraVigente.id,
          bandeiraTarifariaId: response.data.bandeiraVigente.bandeiraTarifariaId,
          mesReferencia: response.data.mesReferencia
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

  onSelectPisCofins(event: any) {
    this.pisCofinsSelected = true; 
    this.control.patchValue({
      impostoId: event.data.id,
      descConcessionaria: event.data.descConcessionaria,
      concessionariaId: event.data.concessionariaId,
      pis: event.data.pis,
      cofins: event.data.cofins
    });
  }

  onSelectProinfaIcms(event: any) {   
    this.proinfaIcmsSelected = true; 
    this.control.patchValue({
      descPontoMedicao: event.data.descPontoMedicao,
      proinfa: event.data.proinfa,
      icms: event.data.icms
    });
  }

  resetFormPisCofins() {
    this.pisCofinsSelected = false;
    this.control.patchValue({
      descConcessionaria: null,
      pis: null,
      cofins: null
    });
  }

  resetFormProinfaIcms() {
    this.proinfaIcmsSelected = false;
    this.control.patchValue({
      descPontoMedicao: null,
      proinfa: null,
      icms: null
    });
  }

  async onSubmitPisCofins() {
    this.loading = true;
    var pisCofins = {
      id: this.control.value.impostoId,
      concessionariaId: this.control.value.concessionariaId,
      pis: this.control.value.pis,
      cofins: this.control.value.cofins,
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
      id: this.control.value.impostoId,
      descPontoMedicao: this.control.value.descPontoMedicao,
      proinfa: this.control.value.proinfa,
      icms: this.control.value.icms,
      mesReferencia: this.mesReferencia
    }
    
    await this.service.postProinfaIcms(proinfaIcms).then((response: IResponseInterface<any>) => {
      if (response.success) {
        this.alertService.showSuccess('Proinfa / ICMS cadastrada com sucesso!');
        this.loadDadosMensais();
      }
    }).finally(() => {
      this.loading = false;
    });
    this.proinfaIcmsSelected = false;
    this.resetFormProinfaIcms();
  }

  onCloseProinfaIcms() {
    this.proinfaIcmsSelected = false;
    this.resetFormProinfaIcms();
  }

  async onSubmitBandeiraVigente() {
    this.loading = true;
    var bandeira = {
      id: this.control.value.bandeiraId,
      bandeira: this.control.value.bandeiraVigente,
      bandeiraTarifariaId: this.control.value.bandeiraTarifariaId,
      mesReferencia: this.mesReferencia     
    }

    await this.service.postBandeira(bandeira).then((response: IResponseInterface<any>) => {
      if (response.success) {
        this.alertService.showSuccess('Bandeira vigente cadastrada com sucesso!');
        this.loadDadosMensais();
      }
    }).finally(() => {
      this.loading = false;
    });
  }
}
