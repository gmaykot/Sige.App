import { Component, OnInit } from '@angular/core';
import { ISalarioMinimo } from '../../../@core/data/gerencial/salario-minimo';
import { DefaultComponent } from '../../../@shared/custom-component/default/default-component';
import { salarioMinimoSettings } from '../../../@shared/table-config/gerencial/salario-minimo.config';
import { NbLayoutScrollService, NbDialogService } from '@nebular/theme';
import { Classes } from '../../../@core/enum/classes.const';
import { SalarioMinimoService } from './salario-minimo.service';
import { AlertService } from '../../../@core/services/util/alert.service';
import { FormBuilderService } from '../../../@core/services/util/form-builder.service';

@Component({
  selector: 'ngx-salario-minimo',
  templateUrl: './salario-minimo.component.html',
  styleUrls: ['./salario-minimo.component.scss']
})
export class SalarioMinimoComponent extends DefaultComponent<ISalarioMinimo> implements OnInit {
  settings = salarioMinimoSettings;  

  constructor(
    protected service: SalarioMinimoService,
    protected formBuilderService: FormBuilderService,
    protected alertService: AlertService,
    protected scroolService: NbLayoutScrollService,
    protected dialogService: NbDialogService
  ) 
  {
    super(Classes.SALARIO_MINIMO, formBuilderService, service, alertService, scroolService, dialogService, true);
  }
}
