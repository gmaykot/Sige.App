import { Component, Input, OnInit } from '@angular/core';
import { IBandeiraTarifariaVigente } from '../../../@core/data/bandeira-tarifaria-vigente';
import { DefaultDialogComponent } from '../default/default-dialog-component';
import { BANDEIRAS } from "../../../@core/enum/const-dropbox";
import { BandeiraTarifariaVigenteService } from '../../../@core/services/gerencial/bandeira-tarifaria-vigente.service';
import { NbDialogRef } from '@nebular/theme';
import { Classes } from '../../../@core/enum/classes.const';
import { AlertService } from '../../../@core/services/util/alert.service';
import { FormBuilderService } from '../../../@core/services/util/form-builder.service';

@Component({
  selector: 'ngx-bandeira-tarifaria-vigente',
  templateUrl: './bandeira-tarifaria-vigente.component.html',
  styleUrls: ['./bandeira-tarifaria-vigente.component.scss']
})
export class BandeiraTarifariaVigenteComponent extends DefaultDialogComponent<IBandeiraTarifariaVigente,BandeiraTarifariaVigenteComponent> implements OnInit {
  @Input() bandeiraVigente: IBandeiraTarifariaVigente;
  public bandeiras = BANDEIRAS;

  constructor(
    protected dialogRef: NbDialogRef<BandeiraTarifariaVigenteComponent>,
    protected service: BandeiraTarifariaVigenteService,
    protected formBuilderService: FormBuilderService,
    protected alertService: AlertService,
  ) 
  {
    super(Classes.BANDEIRA_TARIFARIA_VIGENTE, formBuilderService, alertService, dialogRef);    
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.createControlObject(this.bandeiraVigente);
  }
}
