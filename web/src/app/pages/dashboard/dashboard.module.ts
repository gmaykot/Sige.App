import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard.component';
import { StatusCardComponent } from './status-card/status-card.component';
import { EchartsPieComponent } from '../../@shared/charts/echarts-pie.component';
import { EchartsBarComponent } from '../../@shared/charts/echarts-bar.component';
import { SharedModule } from '../../@shared/shared.module';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    DashboardComponent,
    StatusCardComponent,
    EchartsPieComponent,
    EchartsBarComponent
  ],
})
export class DashboardModule { }
