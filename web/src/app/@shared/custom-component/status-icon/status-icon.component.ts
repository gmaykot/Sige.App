import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';
import { NbDialogService } from '@nebular/theme';
import { CustomDeleteConfirmationComponent } from '../custom-delete-confirmation.component';
import { DefaultService } from '../../../@core/services/default-service';
import { IResponseInterface } from '../../../@core/data/response.interface';
import { AlertService } from '../../../@core/services/util/alert.service';
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
  public service: DefaultService<any>;

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
  constructor(private dialogService: NbDialogService, private alertService: AlertService, private statusEventService: StatusIconEventService) { }

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
    if (this.service){      
      this.dialogService.open(CustomDeleteConfirmationComponent, { context: { mesage: `Deseja realmente ${this.rowData.ativo ? 'DESATIVAR' : 'ATIVAR'} o registro?` } })
      .onClose.subscribe(async (excluir) => {
        if (excluir){        
          this.rowData.ativo = !this.rowData.ativo;        
          await this.toggleActive(this.rowData);          
        }
      });          
    }
  }

  async toggleActive(dado: any) {
    await this.service.toggleActive(dado).then(async (response: IResponseInterface<any>) => {
      if (response.success) {
        this.alertService.showSuccess(`Registro ${dado.ativo ? 'ATIVADO' : 'DESATIVADO'} com sucesso.`);   
        this.statusEventService.emitirClique({service: this.service?.constructor?.name, success: true});
      } else {
        this.statusEventService.emitirClique({service: this.service?.constructor?.name, success: false});
        response.errors?.map((x: any) => this.alertService.showError(x.value));
      }
    }).catch((error) => {
      this.alertService.showError(error);
    });
  }
}