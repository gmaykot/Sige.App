import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard.component';
import { StatusCardComponent } from './status-card/status-card.component';
import { SharedModule } from '../../@shared/shared.module';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    DashboardComponent,
    StatusCardComponent,
  ],
})
export class DashboardModule { }
