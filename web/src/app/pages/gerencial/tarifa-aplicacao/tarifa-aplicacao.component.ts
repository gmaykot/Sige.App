import { Component, OnInit } from '@angular/core';
import { NbDialogService, NbLayoutScrollService } from '@nebular/theme';
import { IDropDown } from '../../../@core/data/drop-down';
import { ConcessionariaService } from '../../../@core/services/gerencial/concessionaria.service';
import { IResponseInterface } from '../../../@core/data/response.interface';
import { settingsTarifaAplicacao } from '../../../@shared/table-config/tarifa-aplicacao.config';
import { TarifaAplicacaoService } from '../../../@core/services/gerencial/tarifa-aplicacao.service';
import { ITarifaAplicacao } from '../../../@core/data/tarifa-aplicacao';
import { FormBuilderService } from '../../../@core/services/util/form-builder.service';
import { DefaultComponent } from '../../default-component';
import { AlertService } from '../../../@core/services/util/alert.service';
import { Classes } from '../../../@core/enum/classes.const';
import { DateService } from '../../../@core/services/util/date.service';
import { MODALIDADES, SUB_GRUPOS } from '../../../@core/enum/const-dropbox';

@Component({
  selector: 'ngx-tarifa-aplicacao',
  templateUrl: './tarifa-aplicacao.component.html',
  styleUrls: ['./tarifa-aplicacao.component.scss']
})
export default class TarifaAplicacaoComponent extends DefaultComponent<ITarifaAplicacao> implements OnInit {
  settings = settingsTarifaAplicacao;
  public concessionarias?: IDropDown[];  
  modalidades = MODALIDADES;
  subgrupos = SUB_GRUPOS;

  constructor(
    private concessionariaService: ConcessionariaService,
    protected service: TarifaAplicacaoService,
    protected formBuilderService: FormBuilderService,
    protected alertService: AlertService,
    protected scroolService: NbLayoutScrollService,
    protected dialogService: NbDialogService,
    private dateService: DateService
  ) 
  {
    super(Classes.TARIFA_APLICACAO, formBuilderService, service, alertService, scroolService, dialogService);
  }

  async ngOnInit() {
    await super.ngOnInit();
    await this.getConcessionarias();    
  }

  async getConcessionarias() {
    this.loading = true;
    await this.concessionariaService
      .getDropDown()
      .then((response: IResponseInterface<IDropDown[]>) => {
        if (response.success) {
          this.concessionarias = response.data;
        }         
      });
    this.loading = false;
  }

  onSelectCustom(event){
    this.onSelect(event);
    this.control.patchValue({dataUltimoReajuste: this.dateService.usStringToPtBrString(this.control.value.dataUltimoReajuste, 'dd/MM/yyyy')});
  }

  onSubmitCustom(): void {
    const oldDate = this.control.value.dataUltimoReajuste;
    this.control.patchValue({dataUltimoReajuste: this.dateService.ptBrStringToUsString(this.control.value.dataUltimoReajuste)});
    this.onSubmit();
    this.control.patchValue({dataUltimoReajuste: oldDate});
  }
}
