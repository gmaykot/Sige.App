import { Component, Input, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { IAgenteMedicao } from '../../@core/data/agente-medicao';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'nb-name-prompt',
  template: `
  <form [formGroup]="control">
  <nb-card accent="warning">
  <input hidden id="id" type="text" formControlName="id">
  <nb-card-header>Cadastro de Agente de Medição</nb-card-header>
  <nb-card-body>
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
            <label for="inputFirstName" class="label">Código de Perfil*</label>
            <input type="text" nbInput fullWidth id="inputFirstName" formControlName="codigoPerfilAgente">
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
export class AgenteMedicaoComponent implements OnInit {
  @Input() agente: IAgenteMedicao;
  public control = this.formBuilder.group({
    id: '',
    empresaId: '',
    nome: '',
    codigoPerfilAgente: '',
    ativo: true,
  });

  constructor(protected dialogRef: NbDialogRef<AgenteMedicaoComponent>, private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.getAgente();
  }

  getAgente()
  {
    this.control = this.formBuilder.group({
      id: this.agente.id,
      empresaId: this.agente.empresaId,
      nome: this.agente.nome,
      codigoPerfilAgente: this.agente.codigoPerfilAgente,
      ativo: this.agente.ativo,
    });
  }
  
  cancel() {
    this.dialogRef.close();
  }

  submit() {
    this.dialogRef.close(this.control.value);
  }
}
