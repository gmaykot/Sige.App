import { Component, Input, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { FormBuilder } from '@angular/forms';
import { IContato } from '../../@core/data/contato';

@Component({
  selector: 'ngx-contato-component',
  template: `
<form [formGroup]="control">
    <nb-card accent="warning">
        <input hidden id="id" type="text" formControlName="id">
        <nb-card-header>Cadastro de Contato</nb-card-header>
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
                        <label for="inputFirstName" class="label">Email*</label>
                        <input type="text" nbInput fullWidth id="inputFirstName" formControlName="email">
                    </div>
                </div>
            </div>
            <div class="row">       
                <div class="col-sm-12">
                    <div class="form-group">
                        <label for="inputFirstName" class="label">Telefone*</label>
                        <input type="text" [mask]="control.get('telefone').value?.length > 10 ? '(00) 00000-0000' : '(00) 0000-00009'" placeholder="(00) 0000-0000" nbInput fullWidth id="inputFirstName" formControlName="telefone">
                    </div>
                </div>
            </div>
            <div class="row">       
                <div class="col-sm-12">
                    <div class="form-group">
                        <label for="inputFirstName" class="label">Setor / Área*</label>
                        <input type="text" nbInput fullWidth id="inputFirstName" formControlName="cargo">
                    </div>
                </div>
            </div>
            <div class="row">       
              <div class="col-sm-12">
                <div class="form-group">
                    <nb-toggle labelPosition="end" formControlName="recebeEmail">Receber E-mail*</nb-toggle>
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
export class ContatoComponent implements OnInit {
  @Input() contato: IContato;
  public control = this.formBuilder.group({
    id: '',
    nome: '',
    email: '',
    telefone: '',
    cargo: '',
    fornecedorId: '',
    empresaId: '',
    recebeEmail: true
  });
  
  constructor(protected dialogRef: NbDialogRef<ContatoComponent>, private formBuilder: FormBuilder) {        
  }

  ngOnInit(): void {
    this.getContato();
  }
  
  getContato()
  {
    this.control = this.formBuilder.group({
      id: this.contato.id,
      nome: this.contato.nome,
      email: this.contato.email,
      telefone: this.contato.telefone,
      cargo: this.contato.cargo,
      fornecedorId: this.contato.fornecedorId,
      empresaId: this.contato.empresaId,
      recebeEmail: this.contato.recebeEmail
    });
  }

  cancel() {
    this.dialogRef.close();
  }

  submit() {
    this.control.value.telefone = this.formatTelefone(this.control.value.telefone);
    this.dialogRef.close(this.control.value);
  }

  formatTelefone(telefone?: string): string {
    if (telefone == null)
      return "";
    telefone = telefone.replace(/\D/g, '');
    if (telefone.length === 10) {
      return telefone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else if (telefone.length === 11) {
      return telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return telefone;
  }
}
