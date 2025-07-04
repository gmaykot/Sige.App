import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: "ngx-custom-registration",
  templateUrl: "./custom-registration.component.html",
  styleUrls: ["./custom-registration.component.scss"],
})
export class CustomRegistrationComponent {
  @Input() settings: any;
  @Input() source: any;
  @Input() loading: boolean = false;
  @Input() edit: boolean = false;
  @Input() selected: boolean = false;
  @Input() title: string = '';
  @Input() showActions: boolean = false;
  @Input() showHelp: boolean = false;
  @Output() deleteConfirm = new EventEmitter();
  @Output() editCustom = new EventEmitter();
  @Output() helpCustom = new EventEmitter();

  onDeleteConfirm(event?: any) {
    this.deleteConfirm.emit(event);
  }

  onEditCustom(event?: any) {
    this.editCustom.emit(event);
  }

  onHelpCustom(event?: any) {
    this.helpCustom.emit(event);
  }
}
