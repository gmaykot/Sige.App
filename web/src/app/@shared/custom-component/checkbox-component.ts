import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';

@Component({
  template: `
  <nb-checkbox (checkedChange)="getChecked($event)"></nb-checkbox>
  `,
})
export class CheckboxComponent implements ViewCell, OnInit {

  renderValue: string;
  @Output() event = new EventEmitter();


  @Input() value: string | number;
  @Input() rowData: any;

  ngOnInit() {
    this.renderValue = this.value?.toString().toUpperCase();
  }

  getChecked($event) {
    this.event.emit({value: $event, data: this.rowData});
  }
}