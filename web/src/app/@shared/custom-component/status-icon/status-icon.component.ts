import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';
import { AlertService } from '../../../@core/services/util/alert.service';
import { AlertComponent } from '../alert-component/alert-component';
import { NbDialogService } from '@nebular/theme';
import { ContatoComponent } from '../contato.component';
import { ContatoService } from '../../../@core/services/gerencial/contato.service';
import { IResponseInterface } from '../../../@core/data/response.interface';
import { IContato } from '../../../@core/data/contato';
import { CustomDeleteConfirmationComponent } from '../custom-delete-confirmation.component';
import { DefaultService } from '../../../@core/services/default-service';
import { StatusIconEventService } from '../../../@core/services/util/status-icon-event.service';

@Component({
  selector: 'app-status-icon',
  template: `
    <i 
      [class]="iconClass" 
      [style.color]="iconColor"
      [style.font-size]="'24px'"
      [style.font-weight]="'600'"
      [style.opacity]="'0.7'"
      [nbTooltip]="tooltipText"
      (mouseenter)="onMouseEnter()"
      (mouseleave)="onMouseLeave()"
      nbTooltipPlacement="top" (click)="onClick()">
    </i>
  `,
  styles: [`
    i {
      cursor: pointer;
      display: inline-block;
      line-height: 1;
    }
  `]
})
export class StatusIconComponent implements ViewCell, OnInit {
  @Input() value: string | number;
  @Input() rowData: any;

  @Output() refreshEvent = new EventEmitter<boolean>();

  public iconColor = 'gray';
  public iconClass: string = '';
  public tooltipText: string = '';

  private hoverColor = '#FFA600';
  private defaultColor = 'gray';

  onMouseEnter() {
    this.iconColor = this.hoverColor;
  }
  
  onMouseLeave() {
    this.iconColor = this.defaultColor;
  }
  constructor(private alertService: AlertService, private dialogService: NbDialogService, private statusEventService: StatusIconEventService) { }


  ngOnInit() {
    const isActive = this.rowData.ativo === true || 
                     this.rowData.ativo === 1 || 
                     this.rowData.ativo === "true";
    
    this.iconClass = isActive ? 'nb-checkmark-circle' : 'nb-close-circled';
    this.iconColor = isActive ? '#28a745' : '#dc3545';
    this.defaultColor = isActive ? '#28a745' : '#dc3545';
    this.tooltipText = isActive ? 'Ativo' : 'Inativo';
  }

  async onClick(){
    this.dialogService.open(CustomDeleteConfirmationComponent, { context: { mesage: `Deseja realmente ${this.rowData.ativo ? 'DESATIVAR' : 'ATIVAR'} o registro?` } })
    .onClose.subscribe(async (excluir) => {
      if (excluir){        
        this.rowData.ativo = !this.rowData.ativo;
        this.statusEventService.emitirClique(this.rowData);
      }
    });          
  }
}