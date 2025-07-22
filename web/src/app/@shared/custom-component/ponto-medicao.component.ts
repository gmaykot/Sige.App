import { Component, Input, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { IPontoMedicao } from '../../@core/data/ponto-medicao';
import { IAgenteMedicao } from '../../@core/data/agente-medicao';
import { FormBuilder, Validators } from '@angular/forms';
import { SEGMENTO, TIPO_CONEXAO, TIPO_ENERGIA } from '../../@core/enum/status-contrato';

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
      <div class="col-sm-6">
        <div class="form-group">
            <label for="inputFirstName" class="label">Código Ponto*</label>
            <input type="text" nbInput fullWidth id="inputFirstName" formControlName="codigo">
        </div>
      </div>
      <div class="col-md-6">
        <div class="form-group">
          <label for="inputLastName" class="label">Tipo de Energia*</label>
          <nb-select fullWidth placeholder="Selecione" formControlName="tipoEnergia">
            <nb-option *ngFor="let ene of tipoEnergia" value="{{ene.id}}">{{ene.desc}}</nb-option>
          </nb-select>
        </div>
      </div>                    
    </div>
    <div class="row">       
      <div class="col-sm-6">
        <div class="form-group">
            <label for="inputLastName" class="label">Segmento*</label>
            <nb-select fullWidth placeholder="Selecione" formControlName="segmento">
              <nb-option *ngFor="let sg of segmento" value="{{sg.id}}">{{sg.desc}}</nb-option>
            </nb-select>
        </div>
      </div>
      <div class="col-sm-6">
        <div class="form-group">
            <label for="inputLastName" class="label">Conexão*</label>
            <nb-select fullWidth placeholder="Selecione" formControlName="conexao">
              <nb-option *ngFor="let sg of conexao" value="{{sg.id}}">{{sg.desc}}</nb-option>
            </nb-select>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-sm-12">
        <div class="form-group">
          <label for="inputLastName" class="label">Concessionária*</label>
          <nb-select fullWidth placeholder="Selecione" formControlName="concessionariaId">
            <nb-option *ngFor="let con of concessionarias"
              value="{{con.id}}">{{con.descricao}}</nb-option>
          </nb-select>
        </div>
      </div>      
    </div>  
    <div class="row">  
      <div class="col-sm-5">
        <div class="form-group">
            <nb-toggle labelPosition="end" formControlName="acumulacaoLiquida">Acumulação Líquida*</nb-toggle>
        </div>
      </div>
      <div class="col-sm-4">
        <div class="form-group">
            <nb-toggle labelPosition="end" formControlName="incideICMS">Incide ICMS*</nb-toggle>
        </div>
      </div>      
      <div class="col-sm-3">
        <div class="form-group">
            <nb-toggle labelPosition="end" formControlName="ativo">Ativo*</nb-toggle>
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
export class PontoMedicaoComponent implements OnInit {
  @Input() ponto: IPontoMedicao;
  @Input() agentes: IAgenteMedicao[];
  @Input() concessionarias: any[];
  segmento = SEGMENTO
  conexao = TIPO_CONEXAO
  tipoEnergia = TIPO_ENERGIA;
  public control = this.formBuilder.group({
    id: '',
    nome: ["", Validators.required],
    codigo: ["", Validators.required],
    agenteMedicaoId: ["", Validators.required],
    agenteMedicao: '',
    segmento: ["", Validators.required],
    conexao: ["", Validators.required],
    tipoEnergia: ["", Validators.required],
    acumulacaoLiquida: false,
    incideICMS: false,
    ativo: true,
    concessionariaId: ["", Validators.required],
    descConcessionaria: ""
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
      incideICMS: this.ponto.incideICMS,
      ativo: this.ponto.ativo,
      segmento: this.ponto.segmento.toString(),
      agenteMedicao: '',
      conexao: this.ponto.conexao.toString(),
      tipoEnergia: this.ponto.tipoEnergia.toString(),
      concessionariaId: this.ponto.concessionariaId,
      descConcessionaria: this.ponto.descConcessionaria
    });
  }

  cancel() {
    this.dialogRef.close();
  }

  submit() {
    this.control.value.agenteMedicao = this.agentes.find(a => a.id == this.control.value.agenteMedicaoId)?.nome;
    this.control.value.descConcessionaria = this.concessionarias.find(a => a.id == this.control.value.concessionariaId)?.descricao;
    this.dialogRef.close(this.control.value);
  }
}
