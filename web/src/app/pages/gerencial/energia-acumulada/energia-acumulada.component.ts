import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { NbTabsetComponent } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';

import { DefaultComponent } from '../../../@shared/custom-component/default/default-component';
import { Classes } from '../../../@core/enum/classes.const';
import { EnergiaAcumuladaEntity } from './energia-acumulada.interface';
import { SmartTableConfigService } from '../../../@core/services/util/smart-table-config.service';
import { EnergiaAcumuladaService } from '../../../@core/services/gerencial/energia-acumulada.service';
import { PontoMedicaoService } from '../../../@core/services/gerencial/ponto-medicao.service';
import { IResponseInterface } from '../../../@core/data/response.interface';
import { IDropDown } from '../../../@core/data/drop-down';

@Component({
  selector: 'ngx-energia-acumulada',
  templateUrl: './energia-acumulada.component.html',
  styleUrls: ['./energia-acumulada.component.scss']
})
export class EnergiaAcumuladaComponent extends DefaultComponent<EnergiaAcumuladaEntity> implements OnInit {
  @ViewChild(NbTabsetComponent) tabset!: NbTabsetComponent;

  public pontosMedicao: Array<IDropDown> = [];
  public pontoMedicaoDesc: string | null = null;
  public sourceHistorico: LocalDataSource = new LocalDataSource();
  public settingsHistorico: any;

  constructor(
    protected injector: Injector,
    private smartService: SmartTableConfigService,
    private pontoMedicaoService: PontoMedicaoService,
    private energiaAcumuladaService: EnergiaAcumuladaService
  ) {
    super(injector, energiaAcumuladaService, Classes.ENERGIA_ACUMULADA, true);
  }

  async ngOnInit() {
    super.ngOnInit();

    this.settings = this.smartService.generateTableSettingsFromObject(
      EnergiaAcumuladaEntity.SourceInstance(),
      {
        exibirStatus: true,
        permitirDelete: true,
      }
    );

    this.settingsHistorico = this.smartService.generateTableSettingsFromObject(
      EnergiaAcumuladaEntity.SourceHistoricoInstance(),
      {
        exibirStatus: false,
        permitirDelete: true,
      }
    );

    await this.getPontosMedicao();
  }

  async onSubmit() {
    await super.onSubmit();
    this.tabset?.selectTab(this.tabset.tabs.toArray()[0]);
    this.pontoMedicaoDesc = this.selectedObject?.pontoMedicaoDesc;
    await this.loadHistorico(this.selectedObject?.pontoMedicaoId);
  }

  async onLoad(event: any) {
    this.loading = true;

    if (event.data) {
      await super.onLoad(event);
      await this.loadHistorico(event.data.pontoMedicaoId);
      this.pontoMedicaoDesc = event.data.pontoMedicaoDesc;
      this.tabset?.selectTab(this.tabset.tabs.toArray()[0]);
    }

    this.loading = false;
  }

  async onSelect(event: any) {
    super.onSelect(event);
    this.tabset?.selectTab(this.tabset.tabs.toArray()[0]);
  }

  async onItemSelected(event: IDropDown) {
    this.loading = true;

    await this.loadHistorico(event.id);

    this.control.patchValue({
      pontoMedicaoId: event.id,
    });
  }

  async getPontosMedicao() {
    this.loading = true;

    await this.pontoMedicaoService
      .getDropDownComSegmento()
      .then((response: IResponseInterface<IDropDown[]>) => {
        if (response.success) {
          this.pontosMedicao = response.data;
        } else {
          this.alertService.showError(response.message, 20000);
          this.source.load([]);
        }
      })
      .finally(() => {
        this.loading = false;
      });
  }

  async loadHistorico(pontoMedicaoId: string) {
    this.loading = true;

    await this.energiaAcumuladaService
      .getPorPontoMedicao(pontoMedicaoId)
      .then((response: IResponseInterface<EnergiaAcumuladaEntity[]>) => {
        if (response.success) {
          this.sourceHistorico.load(response.data);
        } else {
          this.sourceHistorico.load([]);
        }
      })
      .finally(() => {
        this.loading = false;
      });
  }
}
