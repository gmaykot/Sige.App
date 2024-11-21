import { Component, OnInit } from '@angular/core';
import { NbDialogService, NbLayoutScrollService } from '@nebular/theme';
import { AlertService } from '../../../@core/services/util/alert.service';
import { IValorPadrao } from '../../../@core/data/valor-padrao';
import { ValorPadraoService } from '../../../@core/services/gerencial/valor-padrao.service';
import { valorPadraoSettings } from '../../../@shared/table-config/valor-padrao.config';
import { BANDEIRAS } from '../../../@core/enum/const-dropbox';
import { DefaultComponent } from '../../default-component';
import { FormBuilderService } from '../../../@core/services/util/form-builder.service';
import { Classes } from '../../../@core/enum/classes.const';
import { DateService } from '../../../@core/services/util/date.service';

@Component({
  selector: 'ngx-valor-padrao',
  templateUrl: './valor-padrao.component.html',
  styleUrls: ['./valor-padrao.component.scss']
})
export class ValorPadraoComponent extends DefaultComponent<IValorPadrao> {
  settings = valorPadraoSettings;
  bandeiras = BANDEIRAS;
  
  constructor(
    protected formBuilderService: FormBuilderService,
    protected alertService: AlertService,
    protected service: ValorPadraoService,
    protected scroolService: NbLayoutScrollService,
    protected dialogService: NbDialogService,
    private dateService: DateService
  ) 
  { 
    super(Classes.VALOR_PADRAO, formBuilderService, service, alertService, scroolService, dialogService); 
  }

  onSelectCustom(event){
    this.onSelect(event);
    this.control.patchValue({competencia: this.dateService.usStringToPtBrString(this.control.value.competencia, 'MM/yyyy')});
  }
}
