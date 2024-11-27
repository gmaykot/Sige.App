import { LocalDataSource } from "ng2-smart-table";
import { FormBuilderService } from "../../../@core/services/util/form-builder.service";
import { SessionStorageService } from "../../../@core/services/util/session-storage.service";
import { AlertService } from "../../../@core/services/util/alert.service";
import { NbDialogRef } from "@nebular/theme";
import { Component, Inject, OnInit } from "@angular/core";

@Component({
  template: ''
})
export class DefaultDialogComponent<T,C> implements OnInit {
  public control = null;
  public edit = false;
  public loading = true;
  public selected = false;
  public habilitaOperacoes: boolean = false;
  public habilitaValidarRelatorio: boolean = false;
  public source: LocalDataSource = new LocalDataSource();

  constructor(
    @Inject(String) protected className: any,    
    protected formBuilderService: FormBuilderService,
    protected alertService: AlertService,
    protected dialogRef: NbDialogRef<C>
  ) {
    this.control = this.createControl();
    this.habilitaOperacoes = SessionStorageService.habilitaOperacoes();
    this.habilitaValidarRelatorio = SessionStorageService.habilitaValidarRelatorio();   
  }
  
  ngOnInit() {
    this.loading = false;
  }

  createControl() {
    return this.formBuilderService.createFormGroup<T>(this.className);
  }

  createControlObject(objeto) {
    this.control = this.formBuilderService.createFormGroupObject<T>(this.className, objeto);
  }

  onSubmit(): void {
    if (this.control.valid) 
        this.dialogRef.close(this.control.value);
    else this.alertService.showWarning("Os campos obrigatórios não foram preenchidos.");
  }

  onClose() {
    this.dialogRef.close();
  }
}
