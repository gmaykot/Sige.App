import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { ViewCell } from 'ng2-smart-table';
import { CustomDeleteConfirmationComponent } from './custom-delete-confirmation.component';
import { FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { IDropDown } from '../../@core/data/drop-down';

@Component({
    selector: 'nb-name-prompt',
    template: `
    <form [formGroup]="control">
      <nb-card accent="warning">
        <nb-card-header>Selecione a competência</nb-card-header>
        <nb-card-body>
            <div class="row">
                <div class="col-sm-12">
                <div class="form-group">
                    <label for="inputEmail" class="label">Competência da Medição</label><br />
                    <nb-select fullWidth placeholder="Selecione" formControlName="periodo">
                    <nb-option>Selecione</nb-option>
                    <nb-option *ngFor="let mes of meses" value="{{mes.id}}">{{mes.descricao}}</nb-option>
                    </nb-select> 
                </div>
                </div>
            </div>  
        </nb-card-body>
        <nb-card-footer>
        <div class="text-center">
          <button nbButton status="info" (click)="submit()" [disabled]="!control.valid">Confirmar</button>
          <button nbButton status="danger" style="margin-left: 2.5rem;" (click)="cancel()">Cancelar</button>
        </div>
        </nb-card-footer>
      </nb-card>
      </form>
    `,
})
export class HistoricoMedicaoComponent implements OnInit {
    constructor(protected dialogRef: NbDialogRef<CustomDeleteConfirmationComponent>, private formBuilder: FormBuilder, private datePipe: DatePipe) {
    }

    public control = this.formBuilder.group({
        periodo: ["", Validators.required],
      });
    @Input() mesage: string | number;
    meses: Array<IDropDown> = [];
    qtdeMeses = 6;
    dataInicial: Date;

  ngOnInit() {
    this.initSelect();
  }
  
  initSelect() {
    this.dataInicial = new Date();
    this.dataInicial.setUTCMonth(this.dataInicial.getUTCMonth()+1);
    for(var i = 0; i < this.qtdeMeses; i++) {
      this.dataInicial.setUTCMonth(this.dataInicial.getUTCMonth()-1);
        this.meses.push(
        { 
            id: this.datePipe.transform(this.dataInicial, 'yyyy-MM-01'), 
            descricao: this.datePipe.transform(this.dataInicial, 'MM/yyyy')
        });
    }
  }

  cancel() {
    this.dialogRef.close();
  }

  submit() {
    this.dialogRef.close(this.control.value.periodo);
  }
}