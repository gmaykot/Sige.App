import { Component, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'ngx-custom-delete-component',
  template: `
    <nb-card accent="{{accent || 'danger'}}">
      <nb-card-header><h6>Atenção!</h6></nb-card-header>
      <nb-card-body>
        <b>{{mesage || 'Deseja realmente excluir esse registro?'}}</b>
      </nb-card-body>
      <nb-card-footer>
      <div class="text-center">
        <button nbButton status="{{accent || 'danger'}}" (click)="submit()">{{accent ? 'Ok' : 'Confirmar'}}</button>
        <button nbButton status="basic" style="margin-left: 2.5rem;" (click)="cancel()" *ngIf='!accent'>Cancelar</button>
      </div>
      </nb-card-footer>
    </nb-card>
  `,
})
export class CustomDeleteConfirmationComponent {
  constructor(protected dialogRef: NbDialogRef<CustomDeleteConfirmationComponent>) {
  }
  
  @Input() mesage: string;
  @Input() accent: string;

  cancel() {
    this.dialogRef.close();
  }

  submit() {
    this.dialogRef.close(true);
  }
}
