import { Component, OnInit } from "@angular/core";
import { FaturamentoCoenelConfigSettings } from "./faturamento-coenel.config";
import { Classes } from "../../../@core/enum/classes.const";
import { NbLayoutScrollService, NbDialogService } from "@nebular/theme";
import { FaturamentoCoenelService } from "../../../@core/services/geral/faturamento-coenel.service";
import { AlertService } from "../../../@core/services/util/alert.service";
import { FormBuilderService } from "../../../@core/services/util/form-builder.service";

@Component({
  selector: 'ngx-faturamento-coenel',
  templateUrl: './faturamento-coenel.component.html',
  styleUrls: ['./faturamento-coenel.component.scss']
})
export class FaturamentoCoenelComponent extends FaturamentoCoenelConfigSettings implements OnInit {
  
  constructor(
    protected service: FaturamentoCoenelService,
    protected formBuilderService: FormBuilderService,
    protected alertService: AlertService,
    protected scroolService: NbLayoutScrollService,
    protected dialogService: NbDialogService
  ) 
  {
    super(Classes.FATURAMENTO_COENEL, formBuilderService, service, alertService, scroolService, dialogService);
  }
}
