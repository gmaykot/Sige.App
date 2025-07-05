import { LocalDataSource } from "ng2-smart-table";
import { FormBuilderService } from "../../../@core/services/util/form-builder.service";
import { SessionStorageService } from "../../../@core/services/util/session-storage.service";
import { IResponseInterface } from "../../../@core/data/response.interface";
import { AlertService } from "../../../@core/services/util/alert.service";
import { NbDialogService, NbLayoutScrollService } from "@nebular/theme";
import { Component, Inject, Injector, OnDestroy, OnInit } from "@angular/core";
import { CustomDeleteConfirmationComponent } from "../custom-delete-confirmation.component";
import { DefaultService } from "../../../@core/services/default-service";
import { StatusIconEventService } from "../../../@core/services/util/status-icon-event.service";
import { Subscription } from "rxjs";

@Component({
  template: ''
})
export class DefaultComponent<T> implements OnInit, OnDestroy {
  protected formBuilderService: FormBuilderService;
  protected alertService: AlertService;
  protected scrollService: NbLayoutScrollService;
  protected dialogService: NbDialogService;
  protected statusEventService: StatusIconEventService;

  public control = null;
  public edit = false;
  public habilitaOperacoes: boolean = false;
  public habilitaValidarRelatorio: boolean = false;
  public isSuperUsuario: boolean = false;
  public loading = false;
  public selected = false;
  public selectedObject: T;
  public source: LocalDataSource = new LocalDataSource();
  public sourceType: boolean = false;
  public settings: any;
  public statusSubscription: Subscription;

  constructor(
    protected injector: Injector,
    protected service: DefaultService<T>,
    @Inject(String) protected className: string,
    @Inject(Boolean) sourceType: boolean = false
  ) {
    this.formBuilderService = injector.get(FormBuilderService);
    this.alertService = injector.get(AlertService);
    this.scrollService = injector.get(NbLayoutScrollService);
    this.dialogService = injector.get(NbDialogService);
    this.statusEventService = injector.get(StatusIconEventService);
    
    this.control = this.createControl();
    this.isSuperUsuario = SessionStorageService.isSuperUsuario();
    this.habilitaOperacoes = SessionStorageService.habilitaOperacoes();
    this.habilitaValidarRelatorio = SessionStorageService.habilitaValidarRelatorio();
    this.sourceType = sourceType;
  }

  ngOnDestroy(): void {
    this.statusSubscription.unsubscribe();
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

  resetForm(): void {
    this.control.reset();
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
          response.errors?.map((x: any) => this.alertService.showError(x.value));
        }
      }).catch((error) => {
        this.alertService.showError(error);
      });
      this.loading = false;
  }

  onSelect(event: any){
    this.loading = true;
    if (event.data){
      this.clearForm();
      this.createControlObject(event.data);
      this.selectedObject = event.data;
      this.selected = true;
      this.edit = true;
      this.scrollService.scrollTo(0,0);
    }
    this.loading = false;
  }

  onEdit() {
    this.loading = true;
    this.clearForm();
    this.edit = !this.edit;
    this.loading = false;
  }

  async onLoad(event: any) {
    this.loading = true;
    if (event.data){
      await this.service
      .load(event.data?.id)
      .then((response: IResponseInterface<T>) => {
        if (response.success) {
          this.createControlObject(response.data[0]);
          this.selectedObject = response.data[0];
          this.selected = true;
          this.edit = true;
          this.scrollService.scrollTo(0,0);
        } else {
          response.errors?.map((x: any) => this.alertService.showError(x?.value));
        }
      }).catch((error) => {
        this.alertService.showError(error);
      });
    }
    this.loading = false;
  }

  async onSubmit(): Promise<void> {
    this.loading = true;
    if (this.control.valid) 
      await this.onChange();
    else this.alertService.showWarning("Os campos obrigatórios não foram preenchidos.");
    this.loading = false;
  }

  async onRefresh(event: any) {
    if (event && event === true){
      this.clearForm();
      await this.loadSource();
    }
  }

  async onAlert(event: any) {
    if (event){
      switch (event?.type) {
        case 'success':
          this.alertService.showSuccess(event?.message);
          break;
        case 'warning':
          this.alertService.showWarning(event?.message);
          break;
        case 'danger':
          this.alertService.showError(event?.message);
          break;
      }
    }
  }

  async onDelete() {
    this.dialogService
    .open(CustomDeleteConfirmationComponent)
    .onClose.subscribe(async (excluir) => {
      if (excluir) {
        this.loading = true;
        await this.service
        .delete(this.loadObject().id)
        .then(async (response: IResponseInterface<T>) => {
          if (response.success){
            this.clearForm();
            this.alertService.showSuccess("Registro excluído com sucesso.");
            await this.loadSource();
          } else {
            response.errors?.map((x: any) => this.alertService.showError(x.value));
          }
        })
        .catch((error) => {
          this.alertService.showError(error);
        });
        this.loading = false;
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
    this.selectedObject = objct;
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
        res.errors?.map((x: any) => this.alertService.showError(x.value));
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
        res.errors?.map((x: any) => this.alertService.showError(x.value));
      }  
    }).catch((error) => {
      this.alertService.showError(error);
    });
  }
}
