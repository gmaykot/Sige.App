import { Component, Output, EventEmitter, OnChanges } from '@angular/core';

@Component({
  selector: 'ngx-date-filter-component',
  template: `
    <input type="date" (change)="ngOnChanges($event)" class="form-control" />
  `,
})
export class DateFilterComponent implements OnChanges{
  @Output() filter = new EventEmitter<any>();

  ngOnChanges (event: any) {
    if (event.target)
      this.filter.emit(event.target?.value);
  }
}