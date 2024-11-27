import { LocalDataSource } from "ng2-smart-table";
import { FormBuilderService } from "../../../@core/services/util/form-builder.service";
import { SessionStorageService } from "../../../@core/services/util/session-storage.service";
import { IResponseInterface } from "../../../@core/data/response.interface";
import { AlertService } from "../../../@core/services/util/alert.service";
import { NbDialogService, NbLayoutScrollService } from "@nebular/theme";
import { Component, Inject, OnInit } from "@angular/core";
import { CustomDeleteConfirmationComponent } from "../custom-delete-confirmation.component";
import { DefaultService } from "../../../@core/services/default-service";

@Component({
  template: ''
})
export class DefaultComponent<T> implements OnInit {
  public control = null;
  public edit = false;
  public habilitaOperacoes: boolean = false;
  public habilitaValidarRelatorio: boolean = false;
  public isSuperUsuario: boolean = false;
  public loading = true;
  public selected = false;
  public source: LocalDataSource = new LocalDataSource();

  constructor(
    @Inject(String) protected className: any,
    protected formBuilderService: FormBuilderService,
    protected service: DefaultService<T>,
    protected alertService: AlertService,
    protected scroolService: NbLayoutScrollService,
    protected dialogService: NbDialogService
  ) {
    this.control = this.createControl();
    this.isSuperUsuario = SessionStorageService.isSuperUsuario();
    this.habilitaOperacoes = SessionStorageService.habilitaOperacoes();
    this.habilitaValidarRelatorio = SessionStorageService.habilitaValidarRelatorio();   
  }
  
  async ngOnInit() {
    await this.loadSource();
  }

  createControl() {
    return this.formBuilderService.createFormGroup<T>(this.className);
  }

  createControlObject(objeto) {
    this.control = this.formBuilderService.createFormGroupObject<T>(this.className, objeto);
  }

  clearForm(): void {
    this.control.reset();
    this.edit = false;
    this.selected = false;
  }

  loadObject(){
    return this.control.value;
  }

  async loadSource() {
    this.loading = true;
    await this.service
      .get()
      .then((response: IResponseInterface<T[]>) => {
        if (response.success) {
          this.source.load(response.data);
        } else {
          this.source.load([]);
        }
      });
      this.loading = false;
  }

  onSelect(event){
    this.clearForm();
    this.createControlObject(event.data);
    this.selected = true;
    this.edit = true;
    this.scroolService.scrollTo(0,0);
  }

  onEdit() {
    this.clearForm();
    this.edit = !this.edit;
  }

  onSubmit(): void {
    if (this.control.valid) 
      this.onChange();
    else this.alertService.showWarning("Os campos obrigatórios não foram preenchidos.");
  }

  async onDelete() {
    this.dialogService
    .open(CustomDeleteConfirmationComponent)
    .onClose.subscribe(async (excluir) => {
      if (excluir) {
        await this.service
        .delete(this.loadObject().id)
        .then();
        
        this.clearForm();
        this.alertService.showSuccess("Registro excluído com sucesso.");
        await this.loadSource();
      }
    });
  }

   private async onChange() {
    const objct = this.loadObject();
    if (objct.id == null || objct.id == "") {
      await this.post(objct);
    } else {
      await this.put(objct);
    }
    this.edit = true;
    this.selected = true;
  }

  private async post(req: T) {
    await this.service.post(req).then(async (res: IResponseInterface<T>) =>
    {
      this.onSelect(res);
      await this.loadSource();
      this.alertService.showSuccess("Registro cadastrado com sucesso."); 
    });
  }

  private async put(req: T) {
    await this.service.put(req).then();
    {
      await this.loadSource();
      
      this.alertService.showSuccess("Registro alterado com sucesso."); 
    }
  }
}
