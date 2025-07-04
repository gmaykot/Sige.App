import { Component, Input, OnInit } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';

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
      nbTooltipPlacement="top">
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

  iconClass: string = '';
  iconColor: string = '';
  tooltipText: string = '';

  ngOnInit() {
    const isActive = this.rowData.ativo === true || 
                     this.rowData.ativo === 1 || 
                     this.rowData.ativo === "true";
    
    this.iconClass = isActive ? 'nb-checkmark-circle' : 'nb-close-circled';
    this.iconColor = isActive ? '#28a745' : '#dc3545';
    this.tooltipText = isActive ? 'Ativo' : 'Inativo';
  }
}