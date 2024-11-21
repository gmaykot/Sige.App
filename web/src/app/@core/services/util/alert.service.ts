import { Injectable } from "@angular/core";
import { NbGlobalPhysicalPosition, NbToastrService } from "@nebular/theme";

@Injectable({ providedIn: "root" })
export class AlertService {
  private positions = NbGlobalPhysicalPosition;
  private durationDefault: number = 6000;

  constructor(private toastrService: NbToastrService) {}

  showToast(position, status: string, duration: number, message: string) {
    this.toastrService.show(null, message, { position, status, duration });
  }

  showSuccess(message: string, duration?: number) {
    this.showToast(this.positions.TOP_RIGHT, "success", duration ?? this.durationDefault, message);
  }

  showWarning(message: string, duration?: number) {
    this.showToast(this.positions.TOP_RIGHT, "warning", duration ?? this.durationDefault, message);
  }

  showError(message: string, duration?: number) {
    this.showToast(this.positions.TOP_RIGHT, "danger", duration ?? this.durationDefault, message);
  }

  showCustom(message: string, status: 'info', duration?: number) {
    this.showToast(this.positions.TOP_RIGHT, status, duration ?? this.durationDefault, message);
  }
}