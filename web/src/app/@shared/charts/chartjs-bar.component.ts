import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NbThemeService, NbColorHelper } from '@nebular/theme';
import { IValoresGrafico } from '../../@core/data/integracao-ccee.response';

@Component({
  selector: 'ngx-chartjs-bar',
  template: `
    <chart type="bar" [data]="data" [options]="options"></chart>
  `,
})
export class ChartjsBarComponent implements OnDestroy, OnInit {
  @Input() valores: IValoresGrafico[];
  data: any;
  options: any;
  themeSubscription: any;
  
  constructor(private theme: NbThemeService) {
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
      const chartjs: any = config.variables.chartjs;

      this.data = {
        labels: [],
        datasets: [{
          data: [],
          label: 'Consumo HCC',
          backgroundColor: NbColorHelper.hexToRgbA('#00d68f', 0.8),
        }, {
          data: [],
          label: 'Consumo HIF',
          backgroundColor: NbColorHelper.hexToRgbA('#ff3d71', 0.8),
        }],
      };

      this.options = {
        maintainAspectRatio: false,
        responsive: true,
        legend: {
          labels: {
            fontColor: chartjs.textColor,
          },
        },
        scales: {
          xAxes: [
            {
              gridLines: {
                display: false,
                color: chartjs.axisLineColor,
              },
              ticks: {
                fontColor: chartjs.textColor,
              },
            },
          ],
          yAxes: [
            {
              gridLines: {
                display: true,
                color: chartjs.axisLineColor,
              },
              ticks: {
                fontColor: chartjs.textColor,
              },
            },
          ],
        },
      };
    });
  }
  ngOnInit(): void {
    if(this.valores)
      {
        var labels = [];
        var datasetHcc = {
          data: [],
          label: 'Consumo HCC',
          backgroundColor: NbColorHelper.hexToRgbA('#00d68f', 0.8),
        };
        var datasetHif = {
          data: [],
          label: 'Consumo HIF',
          backgroundColor: NbColorHelper.hexToRgbA('#ff3d71', 0.8),
        };
        this.valores.forEach(v =>
          {
            labels.push(v.dia);
            datasetHcc.data.push(v.totalConsumoHCC);
            datasetHif.data.push(v.totalConsumoHIF);
          }
        );
    
        this.data = {
          labels: labels,
          datasets: [datasetHcc, datasetHif],
        };
      }
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }
}
