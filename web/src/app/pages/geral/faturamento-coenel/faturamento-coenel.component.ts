import { Component, OnInit } from "@angular/core";
import { FaturamentoCoenelConfigSettings } from "./faturamento-coenel.config";
import { Classes } from "../../../@core/enum/classes.const";
import { NbLayoutScrollService, NbDialogService } from "@nebular/theme";
import { FaturamentoCoenelService } from "../../../@core/services/geral/faturamento-coenel.service";
import { AlertService } from "../../../@core/services/util/alert.service";
import { FormBuilderService } from "../../../@core/services/util/form-builder.service";
import { EmpresaService } from "../../../@core/services/gerencial/empresa.service";
import { IResponseInterface } from "../../../@core/data/response.interface";
import { IDropDown } from "../../../@core/data/drop-down";
import { Observable, of } from "rxjs";
import { debounceTime, filter, map, startWith } from 'rxjs/operators';
import { PontoMedicaoService } from "../../../@core/services/gerencial/ponto-medicao.service";
import { LocalDataSource } from "ng2-smart-table";
import { IPontoMedicao } from "../../../@core/data/ponto-medicao";
import { IFaturamentoCoenel } from "../../../@core/data/geral/faturamento-coenel";

@Component({
  selector: 'ngx-faturamento-coenel',
  templateUrl: './faturamento-coenel.component.html',
  styleUrls: ['./faturamento-coenel.component.scss']
})
export class FaturamentoCoenelComponent extends FaturamentoCoenelConfigSettings implements OnInit {
  public empresas: Array<IDropDown> = []
  public pontosMedicao: Array<IDropDown> = []
  public options: string[];
  public filteredControlOptions$: Observable<string[]>;
  public sourceHistoricos: LocalDataSource = new LocalDataSource();
  constructor(
    protected service: FaturamentoCoenelService,
    protected formBuilderService: FormBuilderService,
    protected alertService: AlertService,
    protected scroolService: NbLayoutScrollService,
    protected dialogService: NbDialogService,
    private empresaSrvice: EmpresaService,
    private pontoMedicaoService: PontoMedicaoService
  ) 
  {
    super(Classes.FATURAMENTO_COENEL, formBuilderService, service, alertService, scroolService, dialogService);
  }

  async onSelect(event: any) {
    super.onSelect(event);
    await this.loadSourceHistorico(event.data.pontoMedicaoId);
  }

  async ngOnInit() {
    await super.ngOnInit();
    await this.getEmpresas();
    this.onEmpresaChange();
  }

  private async getEmpresas() {
    await this.empresaSrvice
    .getDropDown()
    .then((response: IResponseInterface<IDropDown[]>) => {
      if (response.success) {
        this.empresas = response.data;
      }
    });
  }

  async loadSourceHistorico(pontoMedicaoId: string) {
    this.sourceHistoricos.load([]);
    await this.service
    .getByPontoMedicao(pontoMedicaoId)
    .then((response: IResponseInterface<IFaturamentoCoenel[]>) => {
      if (response.success) {
        this.sourceHistoricos.load(response.data);
      }
    });    
  }

  async onEmpresaChange() {
    this.options = this.empresas.map((x: any) => x.descricao);
    this.filteredControlOptions$ = of(this.options);

    const idMap = new Map(this.empresas.map(x => [x.descricao, x.id]));
    
    this.filteredControlOptions$ = this.control.get('empresaId').valueChanges
      .pipe(
        debounceTime(300),
        filter((value: any) => value && value.length > 2),
        map((filterString: string) => this.filter(filterString))
      );

    this.control.get('empresaId').valueChanges.subscribe(async value => {
      this.pontosMedicao = [];
      this.control.patchValue({ pontoMedicaoId: '' }, { emitEvent: false });
      const id = idMap.get(value);
      if (id) {
        await this.getPontosMedicao(id);
      }
    });
  }

  async getPontosMedicao(empresaId: string) {
    await this.pontoMedicaoService
      .getDropDownPorEmpresa(empresaId)
      .then((response: IResponseInterface<IDropDown[]>) => {
        if (response.success) {
          this.pontosMedicao = response.data;
        }
      });
  }

  private filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(optionValue => optionValue.toLowerCase().includes(filterValue));
  }

  onHistoricoConfirm(){}
  onHistoricoEdit(){}
  onHistoricoDelete(){}
}
