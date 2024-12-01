import { Component, OnInit } from "@angular/core";
import { ConcessionariaService } from "../../../@core/services/gerencial/concessionaria.service";
import { NbDialogService, NbLayoutScrollService } from "@nebular/theme";
import { AlertService } from "../../../@core/services/util/alert.service";
import { Classes } from "../../../@core/enum/classes.const";
import { FormBuilderService } from "../../../@core/services/util/form-builder.service";
import { ImpostoConcessionariaService } from "../../../@core/services/gerencial/imposto-concessionaria.service";
import { ImpostoConcessionariaComponent } from "../../../@shared/custom-component/imposto-concessionaria/imposto-concessionaria.component";
import { IImpostoConcessionaria } from "../../../@core/data/imposto-concessionaria";
import { IResponseInterface } from "../../../@core/data/response.interface";
import { LocalDataSource } from "ng2-smart-table";
import { ConcessionariaConfigSettings } from "./concessionaria.config.settings";
import { CustomDeleteConfirmationComponent } from "../../../@shared/custom-component/custom-delete-confirmation.component";

@Component({
  selector: "ngx-concessionaria",
  templateUrl: "./concessionaria.component.html",
  styleUrls: ["./concessionaria.component.scss"],
})
export class ConcessionariaComponent extends ConcessionariaConfigSettings implements OnInit {
  public sourceImpostos: LocalDataSource = new LocalDataSource();

  constructor(
    protected service: ConcessionariaService,
    protected formBuilderService: FormBuilderService,
    protected alertService: AlertService,
    protected scroolService: NbLayoutScrollService,
    protected dialogService: NbDialogService,
    private impostoService: ImpostoConcessionariaService
  ) 
  {
    super(Classes.CONCESSIONARIA, formBuilderService, service, alertService, scroolService, dialogService);
  }

  async ngOnInit() {
    await super.ngOnInit();
  }

  onSelectCustom(event) {
    super.onSelect(event);
    this.loadSourceImposto();
  }

  async loadSourceImposto() {
    this.loading = true;
    await this.impostoService
      .obterPorConcessionaria(this.control.value.id)
      .then((response: IResponseInterface<IImpostoConcessionaria[]>) => {
        if (response.success) {
          this.sourceImpostos.load(response.data);
        } else {
          this.sourceImpostos.load([]);
        }
      });
      this.loading = false;
  }

  onImpostoConfirm() {
    this.dialogService
    .open(ImpostoConcessionariaComponent, {
      context: { imposto: { concessionariaId: this.control.value.id } as IImpostoConcessionaria },
    })
    .onClose.subscribe(async (ret) => {
      if (ret) {
        await this.impostoService.post(ret).then(async (res: IResponseInterface<IImpostoConcessionaria>) =>
        {          
          if (res.success){     
            await this.loadSourceImposto();
            this.alertService.showSuccess("Imposto cadastrado com sucesso.");
          } else 
          {
            res.errors.map((x) => this.alertService.showError(`${x.value}`));
          }
        });
      }
    });
  }

  onImpostoEdit() {
    if (this.impostosChecked.length > 0){
      this.dialogService
      .open(ImpostoConcessionariaComponent, {
        context: { imposto: this.impostosChecked[0] as IImpostoConcessionaria },
      })
      .onClose.subscribe(async (ret) => {
        if (ret) {
          this.impostoService.put(ret).then(async (res: IResponseInterface<IImpostoConcessionaria>) =>
          {     
            if (res.success){     
              await this.loadSourceImposto();
              this.alertService.showSuccess("Imposto alterado com sucesso.");
            } else 
            {
              res.errors.map((x) => this.alertService.showError(`${x.value}`));
            }
          });
        }      
      });
      this.impostosChecked = [];
  }
  }

  onImpostoDelete() {
    if (this.impostosChecked.length > 0){
      this.dialogService
      .open(CustomDeleteConfirmationComponent, { context: { mesage: 'Deseja realmente excluir os impostos selecionados?'} })
      .onClose.subscribe(async (excluir) => {
        if (excluir){
          var erroExcluir = false;
          this.impostosChecked.forEach(imposto => {
            this.impostoService.delete(imposto.id).then(async (res: IResponseInterface<any>) => {
              if (res.success){
                this.loadSourceImposto();
                this.impostosChecked = [];      
                this.alertService.showSuccess("Imposto excluído com sucesso.");
              } else 
              {
                erroExcluir = true;
                res.errors.map((x) => this.alertService.showError(`Imposto ${imposto.nome} - ${x.value}`));
              }
            });            
          });
        }
      });          
    }
  }
}
