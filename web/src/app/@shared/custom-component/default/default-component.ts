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
  public selectedObject: T;
  public source: LocalDataSource = new LocalDataSource();
  public sourceType: boolean = false;

  constructor(
    @Inject(String) protected className: any,
    protected formBuilderService: FormBuilderService,
    protected service: DefaultService<T>,
    protected alertService: AlertService,
    protected scroolService: NbLayoutScrollService,
    protected dialogService: NbDialogService,
    @Inject(Boolean) sourceType: boolean = false
  ) {
    this.control = this.createControl();
    this.isSuperUsuario = SessionStorageService.isSuperUsuario();
    this.habilitaOperacoes = SessionStorageService.habilitaOperacoes();
    this.habilitaValidarRelatorio = SessionStorageService.habilitaValidarRelatorio();
    this.sourceType = sourceType;
  }
  
  async ngOnInit() {
    await this.loadSource();
  }

  createControl() {
    return this.formBuilderService.createFormGroup<T>(this.className);
  }

  createControlObject(objeto: T) {
    this.control = this.formBuilderService.createFormGroupObject<T>(this.className, objeto);
  }

  clearForm(): void {
    this.control.reset();
    this.edit = false;
    this.selected = false;
    this.selectedObject = null;
  }

  loadObject(){
    this.selectedObject = null;
    return this.control.value;
  }

  async loadSource() {
    this.loading = true;
    await this.service
      .get(this.sourceType)
      .then((response: IResponseInterface<T[]>) => {
        if (response.success) {
          this.source.load(response.data);
        } else {
          this.source.load([]);
        }
      });
      this.loading = false;
  }

  onSelect(event: any){
    if (event.data){
      this.clearForm();
      this.createControlObject(event.data);
      this.selectedObject = event.data;
      this.selected = true;
      this.edit = true;
      this.scroolService.scrollTo(0,0);
    }
  }

  onEdit() {
    this.clearForm();
    this.edit = !this.edit;
  }

  onLoad(id: string) {
    if (id) {
      this.service
      .load(id)
      .then((response: IResponseInterface<T>) => {
        if (response.success) {
          this.createControlObject(response.data[0]);
          this.selectedObject = response.data[0];
          this.selected = true;
          this.edit = true;
          this.scroolService.scrollTo(0,0);
        } else {
          this.alertService.showError("Erro ao carregar registro.");
        }
      });
    }
  }

  async onSubmit(): Promise<void> {
    if (this.control.valid) 
      await this.onChange();
    else this.alertService.showWarning("Os campos obrigatórios não foram preenchidos.");
  }

  async onDelete() {
    this.dialogService
    .open(CustomDeleteConfirmationComponent)
    .onClose.subscribe(async (excluir) => {
      if (excluir) {
        await this.service
        .delete(this.loadObject().id)
        .then(async (response: IResponseInterface<T>) => {
          if (response.success){
            this.clearForm();
            this.alertService.showSuccess("Registro excluído com sucesso.");
            await this.loadSource();
          } else {
            response.errors.map((x) => this.alertService.showError(x.value));
          }
        })
        .catch((error) => {
          this.alertService.showError(error);
        });
      }
    });
  }

   private async onChange() {
    const objct = this.loadObject();
    if (objct?.id == null || objct?.id == "") {
      await this.post(objct);
    } else {
      await this.put(objct);
    }
  }

  private async post(req: T) {
    await this.service.post(req).then(async (res: IResponseInterface<T>) =>
    {
      if (res.success){
        this.onSelect(res);
        await this.loadSource();
        this.alertService.showSuccess("Registro cadastrado com sucesso.");   
        this.edit = true;
        this.selected = true;    
      } else {
        res.errors.map((x) => this.alertService.showError(x.value));
      }  
    }).catch((error) => {
      this.alertService.showError(error);
    });
  }

  private async put(req: T) {
    await this.service.put(req).then(async (res: IResponseInterface<T>) =>
    {
      if (res.success){
        this.onSelect(res);
        await this.loadSource();
        this.alertService.showSuccess("Registro alterado com sucesso.");   
        this.edit = true;
        this.selected = true;    
      } else {
        res.errors.map((x) => this.alertService.showError(x.value));
      }  
    }).catch((error) => {
      this.alertService.showError(error);
    });
  }
}
