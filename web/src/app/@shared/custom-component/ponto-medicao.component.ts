import { Component, Input, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { IPontoMedicao } from '../../@core/data/ponto-medicao';
import { IAgenteMedicao } from '../../@core/data/agente-medicao';
import { FormBuilder } from '@angular/forms';
import { SEGMENTO } from '../../@core/enum/status-contrato';


@Component({
  selector: 'ngx-ponto-medicao-component',
  template: `
  <form [formGroup]="control">
  <nb-card accent="warning">
  <input hidden id="id" type="text" formControlName="id">
  <nb-card-header>Cadastro de Ponto de Medição</nb-card-header>
  <nb-card-body>
  <div class="row">
  <div class="col-sm-12">
      <div class="form-group">
      <label for="inputFirstName" class="label">Agente de Medição*</label>
      <nb-select fullWidth placeholder="Selecione" formControlName="agenteMedicaoId">
      <nb-option *ngFor="let agente of agentes" value="{{agente.id}}">{{agente.nome}}</nb-option>
    </nb-select>

      </div>
  </div>          
  </div>
    <div class="row">
    <div class="col-sm-12">
        <div class="form-group">
        <label for="inputFirstName" class="label">Nome*</label>
        <input type="text" nbInput fullWidth required id="inputFirstName" formControlName="nome">
        </div>
    </div>          
    </div>
    <div class="row">       
        <div class="col-sm-12">
        <div class="form-group">
            <label for="inputFirstName" class="label">Código Ponto*</label>
            <input type="text" nbInput fullWidth id="inputFirstName" formControlName="codigo">
        </div>
        </div>
    </div>
    <div class="row">       
        <div class="col-sm-12">
        <div class="form-group">
            <label for="inputLastName" class="label">Segmento*</label>
            <nb-select fullWidth placeholder="Selecione" formControlName="segmento">
              <nb-option *ngFor="let sg of segmento" value="{{sg.id}}">{{sg.desc}}</nb-option>
            </nb-select>
        </div>
        </div>
    </div>
    <div class="row">       
      <div class="col-sm-12">
        <div class="form-group">
            <nb-toggle labelPosition="end" formControlName="acumulacaoLiquida">Acumulação Líquida*</nb-toggle>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-sm-12">
        <div class="form-group">
            <nb-toggle labelPosition="end" formControlName="ativo">Ativo*</nb-toggle>
        </div>
      </div>
    </div>
  </nb-card-body>
  <nb-card-footer>
  <div class="text-center">
    <button nbButton status="warning" (click)="submit()">Confirmar</button>
    <button nbButton status="basic" style="margin-left: 2.5rem;" (click)="cancel()">Cancelar</button>
  </div>
  </nb-card-footer>  
</nb-card>
</form>
  `,
})
export class PontoMedicaoComponent implements OnInit {
  @Input() ponto: IPontoMedicao;
  @Input() agentes: IAgenteMedicao[];
  segmento = SEGMENTO
  public control = this.formBuilder.group({
    id: '',
    nome: '',
    codigo: '',
    agenteMedicaoId: '',
    agenteMedicao: '',
    segmento: '',
    acumulacaoLiquida: false,
    ativo: true
  });
  
  constructor(protected dialogRef: NbDialogRef<PontoMedicaoComponent>, private formBuilder: FormBuilder) {    
  }

  ngOnInit(): void {
    this.getPonto();
  }
  
  getPonto()
  {
    this.control = this.formBuilder.group({
      id: this.ponto.id,
      nome: this.ponto.nome,
      codigo: this.ponto.codigo,
      agenteMedicaoId: this.ponto.agenteMedicaoId,
      acumulacaoLiquida: this.ponto.acumulacaoLiquida,
      ativo: this.ponto.ativo,
      segmento: this.ponto.segmento.toString(),
      agenteMedicao: ''
    });
  }

  cancel() {
    this.dialogRef.close();
  }

  submit() {
    this.control.value.agenteMedicao = this.agentes.find(a => a.id == this.control.value.agenteMedicaoId)?.nome;
    this.dialogRef.close(this.control.value);
  }
}
