import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EChartsOption, ECharts } from 'echarts';

@Component({
  selector: 'app-chart-renderer',
  template: `
    <div echarts
         [options]="options"
         [style.height.px]="height"
         style="width: 40%; max-width: 100%; position: absolute; left: -9999px; top: 0;"
         (chartInit)="onChartInit($event)">
    </div>
  `
})
export class ChartRendererComponent {
  @Input() options!: EChartsOption;
  @Input() height: number = 250;
  @Output() chartReady = new EventEmitter<ECharts>();

  onChartInit(chart: ECharts) {
    this.chartReady.emit(chart);
  }
}
