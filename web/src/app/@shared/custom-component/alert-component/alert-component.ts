import { Component } from "@angular/core";
import { NbWindowRef } from "@nebular/theme";

@Component({
    selector: "ngx-app-alert",
    templateUrl: "./alert-component.html",
    styleUrls: ["./alert-component.scss"],
  })
  export class AlertComponent {
    constructor(public windowRef: NbWindowRef) {}
  
    close() {
      this.windowRef.close();
    }
  }