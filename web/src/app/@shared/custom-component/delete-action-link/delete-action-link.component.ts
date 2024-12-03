import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-delete-action-link',
  templateUrl: './delete-action-link.component.html',
  styleUrls: ['./delete-action-link.component.scss']
})
export class DeleteActionLinkComponent {
  @Input() value: any; // O valor da linha
  @Input() rowData: any; // Dados da linha inteira
  @Output() action = new EventEmitter<any>();
  
  constructor(private router: Router){

  }
  
  get iconClass(): string {
    return this.rowData.finalizado ? 'nb-checkmark' : 'nb-close';
  }  
  get buttonContent(): string {
    return this.rowData.finalizado ? 'abcd' : 'jhsgh';
  }

  onAction() {
    this.router.navigate([this.rowData.link]);
    this.action.emit(this.rowData);
  }
}