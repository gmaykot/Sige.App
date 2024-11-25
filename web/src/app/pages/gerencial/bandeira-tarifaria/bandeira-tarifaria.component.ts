import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { NbDialogService, NbLayoutScrollService } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';
import { ConcessionariaService } from '../../../@core/services/gerencial/concessionaria.service';
import { ContratoService } from '../../../@core/services/gerencial/contrato.service';
import { EmpresaService } from '../../../@core/services/gerencial/empresa.service';
import { FornecedorService } from '../../../@core/services/gerencial/fornecedor.service';
import { ValorAnualContratoService } from '../../../@core/services/gerencial/valor-anual-contrato';
import { ValorMensalContratoService } from '../../../@core/services/gerencial/valor-mensal-contrato';
import { AlertService } from '../../../@core/services/util/alert.service';
import { DateService } from '../../../@core/services/util/date.service';
import { BandeiraTarifariaConfigSettings } from './bandeira-tarifaria.config.settings';
import { BandeiraTarifariaService } from '../../../@core/services/gerencial/bandeira-tarifaria.service';
import { IBandeiraTarifaria } from '../../../@core/data/bandeira-tarifaria';
import { IResponseIntercace } from '../../../@core/data/response.interface';
import { SessionStorageService } from '../../../@core/services/util/session-storage.service';
import { CustomDeleteConfirmationComponent } from '../../../@shared/custom-component/custom-delete-confirmation.component';

@Component({
  selector: 'ngx-bandeira-tarifaria',
  templateUrl: './bandeira-tarifaria.component.html',
  styleUrls: ['./bandeira-tarifaria.component.scss']
})
export class BandeiraTarifariaComponent extends BandeiraTarifariaConfigSettings implements OnInit{
  public source: LocalDataSource = new LocalDataSource();
  public loading: boolean;
  public edit: boolean;
  public selected: boolean;
  public habilitaOperacoes: boolean = false;

  public control = this.formBuilder.group({
    id: '', 
    dataVigenciaInicial: ["", Validators.required],
    dataVigenciaFinal: ["", Validators.required],
    valorBandeiraVerde: [0, Validators.required],
    valorBandeiraAmarela: [0, Validators.required],
    valorBandeiraVermelha1: [0, Validators.required],
    valorBandeiraVermelha2: [0, Validators.required],
    ativo: true
  });  


  constructor(
    private formBuilder: FormBuilder,
    private service: BandeiraTarifariaService,
    private datePipe: DatePipe,
    private dateService: DateService,
    private dialogService: NbDialogService,
    private alertService: AlertService,
    private scroolService: NbLayoutScrollService
  ) { super();}
  
  async ngOnInit() {
    await this.getBandeiras();
    this.limparFormulario();
    this.habilitaOperacoes = SessionStorageService.habilitaOperacoes();
  }

  async getBandeiras() {
    this.loading = true;
    await this.service
      .get()
      .then((response: IResponseIntercace<IBandeiraTarifaria[]>) => {
        if (response.success) {
          this.source.load(response.data);
        } else {
          this.source.load([]);
        }      
        this.loading = false;
      }).catch((e) => {
        this.loading = false;
        this.alertService.showError(e);
      });    
  }

  private getBandeira(): IBandeiraTarifaria {
    var bandeira = this.control.value as IBandeiraTarifaria;
    bandeira.dataVigenciaInicial = this.dateService.ptBrStringToUsString(bandeira.dataVigenciaInicial);
    bandeira.dataVigenciaFinal = this.dateService.ptBrStringToUsString(bandeira.dataVigenciaFinal);
    return bandeira
  }

  limparFormulario(): void {
    this.control.reset();
    this.edit = false;
    this.selected = false;
  }

  onSelect(event): void {
    this.limparFormulario();
    const band = event.data as IBandeiraTarifaria;
    this.control = this.formBuilder.group({
      id: band.id, 
      dataVigenciaFinal: [this.datePipe.transform(band.dataVigenciaFinal, 'dd/MM/yyyy')],
      dataVigenciaInicial: [this.datePipe.transform(band.dataVigenciaInicial, 'dd/MM/yyyy')],
      valorBandeiraVerde: band.valorBandeiraVerde,
      valorBandeiraAmarela: band.valorBandeiraAmarela,
      valorBandeiraVermelha1: band.valorBandeiraVermelha1,
      valorBandeiraVermelha2: band.valorBandeiraVermelha2,
      ativo: band.ativo
    });
    this.edit = true;
    this.selected = true;
    this.scroolService.scrollTo(0,0);  
  }

  onEdit() {
    this.edit = !this.edit;
  }

  async onDeleteConfirm() {
    this.dialogService
      .open(CustomDeleteConfirmationComponent)
      .onClose.subscribe(async (excluir) => {
        if (excluir) {
          await this.service
          .delete(this.getBandeira().id)
          .then(async () => {
            this.limparFormulario();
            this.alertService.showSuccess("Bandeira excluída com sucesso.");
            await this.getBandeiras();
          }).catch(() => {
            this.alertService.showError("Não foi possível excluir a bandeira neste momento.");
          });
        }
      });
  }

  onSubmit(): void {
    this.changeContrato();
  }

  private async changeContrato() {
    const bandeira = this.getBandeira();
    if (bandeira.id == null || bandeira.id == "") {
      await this.post(bandeira);
    } else {
      await this.put(bandeira);
    }
  }

  private async post(bandeira: IBandeiraTarifaria) {
    await this.service.post(bandeira).then(async (res: IResponseIntercace<IBandeiraTarifaria>) =>
    {
      this.onSelect(res);
      await this.getBandeiras();
      this.alertService.showSuccess("Bandeira cadastrada com sucesso.");
    }).catch(() => {
      this.alertService.showError("Não foi possível cadastrar a bandeira neste momento.");
    });
  }

  private async put(bandeira: IBandeiraTarifaria) {
    await this.service.put(bandeira).then(async () => {
      await this.getBandeiras();
      this.alertService.showSuccess("Bandeira alterada com sucesso.");
    }).catch(() => {
      this.alertService.showError("Não foi possível alterar a bandeira neste momento.");
    });
  }
}
