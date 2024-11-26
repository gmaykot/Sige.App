import { Component, Input, OnInit } from '@angular/core';
import { IImpostoConcessionaria } from '../../../@core/data/imposto-concessionaria';
import { ImpostoConcessionariaService } from '../../../@core/services/gerencial/imposto-concessionaria.service';
import { NbDialogRef } from '@nebular/theme';
import { Classes } from '../../../@core/enum/classes.const';
import { AlertService } from '../../../@core/services/util/alert.service';
import { FormBuilderService } from '../../../@core/services/util/form-builder.service';
import { DefaultDialogComponent } from '../../../pages/default-dialog-component';

@Component({
  selector: 'ngx-imposto-concessionaria',
  templateUrl: './imposto-concessionaria.component.html',
  styleUrls: ['./imposto-concessionaria.component.scss']
})
export class ImpostoConcessionariaComponent extends DefaultDialogComponent<IImpostoConcessionaria,ImpostoConcessionariaComponent> implements OnInit {
  @Input() imposto: IImpostoConcessionaria;

  constructor(
    protected dialogRef: NbDialogRef<ImpostoConcessionariaComponent>,
    protected service: ImpostoConcessionariaService,
    protected formBuilderService: FormBuilderService,
    protected alertService: AlertService,
  ) 
  {
    super(Classes.IMPOSTO_CONCESSIONARIA, formBuilderService, alertService, dialogRef);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.createControlObject(this.imposto);
  }
}
