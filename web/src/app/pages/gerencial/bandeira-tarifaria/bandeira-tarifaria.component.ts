import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { NbDialogService, NbLayoutScrollService } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';
import { AlertService } from '../../../@core/services/util/alert.service';
import { DateService } from '../../../@core/services/util/date.service';
import { BandeiraTarifariaConfigSettings } from './bandeira-tarifaria.config.settings';
import { BandeiraTarifariaService } from '../../../@core/services/gerencial/bandeira-tarifaria.service';
import { IBandeiraTarifaria } from '../../../@core/data/bandeira-tarifaria';
import { IResponseInterface } from '../../../@core/data/response.interface';
import { SessionStorageService } from '../../../@core/services/util/session-storage.service';
import { CustomDeleteConfirmationComponent } from '../../../@shared/custom-component/custom-delete-confirmation.component';
import { IBandeiraTarifariaVigente } from '../../../@core/data/bandeira-tarifaria-vigente';
import { BandeiraTarifariaVigenteService } from '../../../@core/services/gerencial/bandeira-tarifaria-vigente.service';
import { BandeiraTarifariaVigenteComponent } from '../../../@shared/custom-component/bandeira-tarifaria-vigente/bandeira-tarifaria-vigente.component';

@Component({
  selector: 'ngx-bandeira-tarifaria',
  templateUrl: './bandeira-tarifaria.component.html',
  styleUrls: ['./bandeira-tarifaria.component.scss']
})
export class BandeiraTarifariaComponent extends BandeiraTarifariaConfigSettings implements OnInit{
  public source: LocalDataSource = new LocalDataSource();
  public sourceBandeiras: LocalDataSource = new LocalDataSource();
  public loading: boolean;
  public edit: boolean;
  public selected: boolean;
  public habilitaOperacoes: boolean = false;

  public control = this.formBuilder.group({
    id: '', 
    vigenciaInicial: ["", Validators.required],
    vigenciaFinal: [""],
    valorBandeiraVerde: [0, Validators.required],
    valorBandeiraAmarela: [0, Validators.required],
    valorBandeiraVermelha1: [0, Validators.required],
    valorBandeiraVermelha2: [0, Validators.required],
    ativo: true
  });

  constructor(
    private formBuilder: FormBuilder,
    private service: BandeiraTarifariaService,
    private bandeiraVigenteService: BandeiraTarifariaVigenteService,
    private dialogService: NbDialogService,
    private alertService: AlertService,
    private scroolService: NbLayoutScrollService,

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
      .then((response: IResponseInterface<IBandeiraTarifaria[]>) => {
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
      vigenciaFinal: band.vigenciaFinal,
      vigenciaInicial: band.vigenciaInicial,
      valorBandeiraVerde: band.valorBandeiraVerde,
      valorBandeiraAmarela: band.valorBandeiraAmarela,
      valorBandeiraVermelha1: band.valorBandeiraVermelha1,
      valorBandeiraVermelha2: band.valorBandeiraVermelha2,
      ativo: band.ativo
    });
    this.loadSourceBandeiras();
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
    this.change();
  }

  private async change() {
    const bandeira = this.getBandeira();
    if (bandeira.id == null || bandeira.id == "") {
      await this.post(bandeira);
    } else {
      await this.put(bandeira);
    }
  }

  private async post(bandeira: IBandeiraTarifaria) {
    await this.service.post(bandeira).then(async (res: IResponseInterface<IBandeiraTarifaria>) =>
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

  async loadSourceBandeiras() {
    this.loading = true;
    await this.bandeiraVigenteService
      .obterPorBandeira(this.control.value.id)
      .then((response: IResponseInterface<IBandeiraTarifariaVigente[]>) => {
        if (response.success) {
          this.sourceBandeiras.load(response.data);
        } else {
          this.sourceBandeiras.load([]);
        }
      });
      this.loading = false;
  }

  onBandeiraConfirm() {
    this.dialogService
    .open(BandeiraTarifariaVigenteComponent, {
      context: { bandeiraVigente: { bandeiraTarifariaId: this.control.value.id } as IBandeiraTarifariaVigente },
    })
    .onClose.subscribe(async (ret) => {
      if (ret) {
        await this.bandeiraVigenteService.post(ret).then(async (res: IResponseInterface<IBandeiraTarifariaVigente>) =>
        {          
          if (res.success){     
            await this.loadSourceBandeiras();
            this.alertService.showSuccess("Imposto cadastrado com sucesso.");
          } else 
          {
            res.errors.map((x) => this.alertService.showError(`${x.value}`));
          }
        });
      }
    });
  }

  onBandeiraEdit() {
    if (this.bandeirasChecked.length > 0){
      this.dialogService
      .open(BandeiraTarifariaVigenteComponent, {
        context: { bandeiraVigente: this.bandeirasChecked[0] as IBandeiraTarifariaVigente },
      })
      .onClose.subscribe(async (ret) => {
        if (ret) {
          this.bandeiraVigenteService.put(ret).then(async (res: IResponseInterface<IBandeiraTarifariaVigente>) =>
          {     
            if (res.success){     
              await this.loadSourceBandeiras();
              this.alertService.showSuccess("Imposto alterado com sucesso.");
            } else 
            {
              res.errors.map((x) => this.alertService.showError(`${x.value}`));
            }
          });
        }      
      });
      this.bandeirasChecked = [];
  }
}

  onBandeiraDelete() {
    if (this.bandeirasChecked.length > 0){
      this.dialogService
      .open(CustomDeleteConfirmationComponent, { context: { mesage: 'Deseja realmente excluir as bandeiras selecionadas?'} })
      .onClose.subscribe(async (excluir) => {
        if (excluir){
          var erroExcluir = false;
          this.bandeirasChecked.forEach(bandeira => {
            this.bandeiraVigenteService.delete(bandeira.id).then(async (res: IResponseInterface<any>) => {
              if (res.success){
                this.loadSourceBandeiras();
                this.bandeirasChecked = [];      
                this.alertService.showSuccess("Bandeira excluída com sucesso.");
              } else 
              {
                erroExcluir = true;
                res.errors.map((x) => this.alertService.showError(`Bandeira ${bandeira.bandeira} - ${x.value}`));
              }
            });            
          });
        }
      });          
    }
  }
}
