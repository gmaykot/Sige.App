import { Component, Input, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { FormBuilder, Validators } from '@angular/forms';
import { IContato } from '../../@core/data/contato';
import { IValorAnual } from '../../@core/data/valor-anual';
import { DatePipe } from '@angular/common';
import { DateService } from '../../@core/services/util/date.service';

@Component({
  selector: 'nb-name-prompt',
  template: `
<form [formGroup]="control">
    <nb-card accent="warning">
        <input hidden id="id" type="text" formControlName="id">
        <nb-card-header>Cadastro de Valor Anual</nb-card-header>
        <nb-card-body>
            <div class="row">
                <div class="col-sm-12">
                    <div class="form-group">
                        <label for="inputFirstName" class="label">Vigência Inicial*</label>
                        <input nbInput fullWidth mask="d0/M0/0000" placeholder="__/__/____" [dropSpecialCharacters]="false" fieldSize="small" formControlName="dataVigenciaInicial">              
                    </div>
                </div>          
            </div>
            <div class="row">       
                <div class="col-sm-12">
                    <div class="form-group">
                        <label for="inputFirstName" class="label">Vigência Final*</label>
                        <input nbInput fullWidth mask="d0/M0/0000" placeholder="__/__/____" [dropSpecialCharacters]="false" fieldSize="small" formControlName="dataVigenciaFinal">              
                    </div>
                </div>
            </div>
            <div class="row">       
                <div class="col-sm-12">
                    <div class="form-group">
                        <label for="inputFirstName" class="label">Valor Unitário (R$)*</label>
                        <input type="number" nbInput fullWidth id="inputFirstName" formControlName="valorUnitarioKwh">
                    </div>
                </div>
            </div>
        </nb-card-body>
        <nb-card-footer>
            <div class="text-center">
                <button nbButton status="warning" (click)="submit()" [disabled]="!control.valid">Confirmar</button>
                <button nbButton status="basic" style="margin-left: 2.5rem;" (click)="cancel()">Cancelar</button>
            </div>
        </nb-card-footer>  
    </nb-card>
</form>
  `,
})
export class ValorAnualComponent implements OnInit {
    @Input() valor: IValorAnual;
    @Input() contratoId: string;
    @Input() dateService: DateService
  public control = this.formBuilder.group({
    id: ["", Validators.required],
    dataVigenciaInicial: ["", Validators.required],
    dataVigenciaFinal: ["", Validators.required],
    valorUnitarioKwh: [0, Validators.required],
    contratoId: ''
  });
  
  constructor(protected dialogRef: NbDialogRef<ValorAnualComponent>, private formBuilder: FormBuilder) {        
  }

  ngOnInit(): void {
    this.getValores();
  }

  getValores() {
    this.control = this.formBuilder.group({
        id: this.valor.id,
        dataVigenciaInicial: this.dateService.usStringToPtBrString(this.valor.dataVigenciaInicial),
        dataVigenciaFinal: this.dateService.usStringToPtBrString(this.valor.dataVigenciaFinal),
        valorUnitarioKwh: this.valor.valorUnitarioKwh,
        contratoId: this.contratoId
    });
  }
  
  cancel() {
    this.dialogRef.close();
  }

  submit() {
    this.valor.id = this.control.value.id;
    this.valor.contratoId = this.contratoId;
    this.valor.valorUnitarioKwh = this.control.value.valorUnitarioKwh;
    this.valor.dataVigenciaInicial = this.dateService.ptBrStringToUsString(this.control.value.dataVigenciaInicial, "yyyy-MM-dd");
    this.valor.dataVigenciaFinal = this.dateService.ptBrStringToUsString(this.control.value.dataVigenciaFinal, "yyyy-MM-dd");
    this.dialogRef.close(this.valor);
  }
}
