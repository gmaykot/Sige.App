import { Component, Injector, OnInit } from '@angular/core';
import { DefaultComponent } from '../../../@shared/custom-component/default/default-component';
import { salarioMinimoSettings } from '../../../@shared/table-config/gerencial/salario-minimo.config';
import { NbLayoutScrollService, NbDialogService } from '@nebular/theme';
import { Classes } from '../../../@core/enum/classes.const';
import { SalarioMinimoService } from './salario-minimo.service';
import { AlertService } from '../../../@core/services/util/alert.service';
import { FormBuilderService } from '../../../@core/services/util/form-builder.service';
import { SalarioMinimoEntity } from './salario-minimo.interface';
import { SmartTableConfigService } from '../../../@core/services/util/smart-table-config.service';

@Component({
  selector: 'ngx-salario-minimo',
  templateUrl: './salario-minimo.component.html',
  styleUrls: ['./salario-minimo.component.scss']
})
export class SalarioMinimoComponent extends DefaultComponent<SalarioMinimoEntity> implements OnInit {
  constructor(
    protected service: SalarioMinimoService,
    private smartService: SmartTableConfigService,
    protected injector: Injector
  ) 
  {
    super(injector, service, Classes.SALARIO_MINIMO, true);
  }

  ngOnInit(): Promise<void> {
    this.settings = this.smartService.generateTableSettingsFromObject(SalarioMinimoEntity.SourceInstance(), {
      exibirStatus: true,
      permitirDelete: true,
    });
    return super.ngOnInit();
  }
}
