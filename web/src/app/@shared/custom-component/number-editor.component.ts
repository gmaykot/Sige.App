import { Component } from "@angular/core";
import { DefaultEditor } from "ng2-smart-table";

@Component({
  template: `
    <input
      type="number"
      class="form-control"
      [(ngModel)]="cell.newValue"
      (ngModelChange)="updateValue($event)"
    />
  `,
})
export class NumberEditorComponent extends DefaultEditor {
  updateValue(value: any) {
    if (typeof value === "string") {
      value = value.replace(/\./g, "").replace(",", ".");
    }
    this.cell.newValue = value ? parseFloat(value) : 0;
  }
}
