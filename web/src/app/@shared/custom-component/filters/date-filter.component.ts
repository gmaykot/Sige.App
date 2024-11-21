import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'date-filter',
  template: `
    <input type="date" (change)="onDateChange($event)" class="form-control" />
  `,
})
export class DateFilterComponent {
  @Output() filter = new EventEmitter<any>();

  onDateChange(event: any) {
    const selectedDate = event.target.value;
    this.filter.emit(selectedDate);
  }
}