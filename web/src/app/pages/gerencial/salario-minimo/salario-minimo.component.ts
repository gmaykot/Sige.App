import { Component, Injector, OnInit } from '@angular/core';
import { DefaultComponent } from '../../../@shared/custom-component/default/default-component';
import { Classes } from '../../../@core/enum/classes.const';
import { SalarioMinimoService } from './salario-minimo.service';
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
