import { Component } from '@angular/core';
import { AjudaOperacaoComponent } from '../../../@shared/custom-component/ajuda-operacao/ajuda-operacao.component';
import { NbLayoutScrollService, NbDialogService } from '@nebular/theme';
import { GerenciamentoMensalService } from '../../../@core/services/geral/gerenciamento-mensal.service';
import { AlertService } from '../../../@core/services/util/alert.service';
import { FormBuilderService } from '../../../@core/services/util/form-builder.service';
import { DateService } from '../../../@core/services/util/date.service';
import { LocalDataSource } from 'ng2-smart-table';
import { GerenciamentoMensalConfigSettings } from './gerenciamento-mensal.config';

@Component({
  selector: 'ngx-gerenciamento-mensal',
  templateUrl: './gerenciamento-mensal.component.html',
  styleUrls: ['./gerenciamento-mensal.component.scss']
})
export class GerenciamentoMensalComponent extends GerenciamentoMensalConfigSettings {
public sourcePisCofins: LocalDataSource = new LocalDataSource();
public sourceProinfaIcms: LocalDataSource = new LocalDataSource();
public controlPisCofins = null;
public controlProinfaIcms = null;

  constructor(
    protected service: GerenciamentoMensalService,
    protected formBuilderService: FormBuilderService,
    protected alertService: AlertService,
    protected scroolService: NbLayoutScrollService,
    protected dialogService: NbDialogService,
    protected dateService: DateService
  ) 
  {
    super();
  }

  pisCofins: any[] = [
    {descConcessionaria: 'CEEE', valorPis: 0, valorCofins: 0},
    {descConcessionaria: 'CELESC', valorPis: 0, valorCofins: 0},
    {descConcessionaria: 'RGE Sul', valorPis: 0, valorCofins: 0},
  ];
  proinfaIcms: any[] = [
    {descPontoMedicao: 'ELOBRAS MATRIZ', valorProinfa: 0, valorIcms: 0},
    {descPontoMedicao: 'BIANCHINI CANOAS', valorProinfa: 0, valorIcms: 0},
    {descPontoMedicao: 'BENTEC MATRIZ', valorProinfa: 0, valorIcms: 0},
  ];

  async ngOnInit() {
    this.sourcePisCofins.load(this.pisCofins);
    this.sourceProinfaIcms.load(this.proinfaIcms);
  }

  getMeses()
  {
    return this.dateService.getMesesReferencia(6);
  }

  onHelp() {
    this.dialogService.open(AjudaOperacaoComponent, { context: { tipoAjuda: 'lancamentos-mensais' } });
  }

  onSearch($event){
  }

  onSelect(event: any) {
    
  }
}
