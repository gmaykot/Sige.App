import { Component, OnInit } from "@angular/core";
import { ConcessionariaService } from "../../../@core/services/gerencial/concessionaria.service";
import { IConcessionaria } from "../../../@core/data/concessionarias";
import { UF } from "../../../@core/data/estados";
import { NbDialogService, NbLayoutScrollService } from "@nebular/theme";
import { concessionariaSettings, impostoSettings } from "../../../@shared/table-config/concessionaria.config";
import { AlertService } from "../../../@core/services/util/alert.service";
import { DefaultComponent } from "../../default-component";
import { Classes } from "../../../@core/enum/classes.const";
import { FormBuilderService } from "../../../@core/services/util/form-builder.service";
import { ImpostoConcessionariaService } from "../../../@core/services/gerencial/imposto-concessionaria.service";

@Component({
  selector: "ngx-concessionaria",
  templateUrl: "./concessionaria.component.html",
  styleUrls: ["./concessionaria.component.scss"],
})
export class ConcessionariaComponent extends DefaultComponent<IConcessionaria> implements OnInit {
  public settings = concessionariaSettings;
  public settingsImpostos = impostoSettings
  public estados = UF;
  public impostosChecked = [];

  constructor(
    protected service: ConcessionariaService,
    protected formBuilderService: FormBuilderService,
    protected alertService: AlertService,
    protected scroolService: NbLayoutScrollService,
    protected dialogService: NbDialogService,
    private impostoConcessionariaService: ImpostoConcessionariaService
  ) 
  {
    super(Classes.CONCESSIONARIA, formBuilderService, service, alertService, scroolService, dialogService);
  }

  async ngOnInit() {
    await super.ngOnInit();
  }

  onSelectCustom(event) {
    super.onSelect(event);
  }

  onImpostoConfirm(){}
  onImpostoEdit(){}
  onImpostoDelete(){}
}
