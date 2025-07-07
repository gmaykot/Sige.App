import { Component, OnInit, Injector } from "@angular/core";
import { LocalDataSource } from "ng2-smart-table";
import { IImpostoConcessionaria } from "../../../@core/data/imposto-concessionaria";
import { IResponseInterface } from "../../../@core/data/response.interface";
import { Classes } from "../../../@core/enum/classes.const";
import { CustomDeleteConfirmationComponent } from "../../../@shared/custom-component/custom-delete-confirmation.component";
import { ImpostoConcessionariaComponent } from "../../../@shared/custom-component/imposto-concessionaria/imposto-concessionaria.component";
import { ConcessionariaConfigSettings } from "./concessionaria.config.settings";
import { ConcessionariaService } from "./concessionaria.service";
import { ImpostoConcessionariaService } from "./imposto-concessionaria.service";


@Component({
  selector: "ngx-concessionaria",
  templateUrl: "./concessionaria.component.html",
  styleUrls: ["./concessionaria.component.scss"],
})
export class ConcessionariaComponent extends ConcessionariaConfigSettings implements OnInit {
  public sourceImpostos: LocalDataSource = new LocalDataSource();

  constructor(
    protected service: ConcessionariaService,
    private impostoService: ImpostoConcessionariaService,
    protected injector: Injector
  ) 
  {
    super(injector, service, Classes.CONCESSIONARIA);
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
          this.impostosChecked.forEach(imposto => {
            this.impostoService.delete(imposto.id).then(async (res: IResponseInterface<any>) => {
              if (res.success){
                this.loadSourceImposto();
                this.impostosChecked = [];      
                this.alertService.showSuccess("Imposto excluído com sucesso.");
              } else 
              {
                res.errors.map((x) => this.alertService.showError(`Imposto ${imposto.nome} - ${x.value}`));
              }
            });            
          });
        }
      });          
    }
  }
}
