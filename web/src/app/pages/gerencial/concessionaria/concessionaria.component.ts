import { Component, OnInit } from "@angular/core";
import { LocalDataSource } from "ng2-smart-table";
import { ConcessionariaService } from "../../../@core/services/gerencial/concessionaria.service";
import { FormBuilder, Validators } from "@angular/forms";
import { IConcessionaria } from "../../../@core/data/concessionarias";
import { IResponseIntercace } from "../../../@core/data/response.interface";
import { UF } from "../../../@core/data/estados";
import { NbDialogService, NbLayoutScrollService } from "@nebular/theme";
import { CustomDeleteConfirmationComponent } from "../../../@shared/custom-component/custom-delete-confirmation.component";
import { concessioanriaSettings } from "../../../@shared/table-config/concessionaria.config";
import { AlertService } from "../../../@core/services/util/alert.service";
import { SessionStorageService } from "../../../@core/services/util/session-storage.service";

@Component({
  selector: "ngx-concessionaria",
  templateUrl: "./concessionaria.component.html",
  styleUrls: ["./concessionaria.component.scss"],
})
export class ConcessionariaComponent implements OnInit {
  settings = concessioanriaSettings;
  public estados: any;
  public edit = false;
  public selected = false;
  source: LocalDataSource = new LocalDataSource();
  public control = this.formBuilder.group({
    id: "",
    gestorId: "",
    ativo: false,
    nome: ["", Validators.required],
    estado: ["", Validators.required],
  });
  public loading = true;
  public habilitaOperacoes: boolean = false;

  getEstadoDescricao(uf) {
    return this.estados.find((e) => e.uf == uf);
  }

  constructor(
    private formBuilder: FormBuilder,
    private concessionariaService: ConcessionariaService,
    private dialogService: NbDialogService,
    private alertService: AlertService,
    private scroolService: NbLayoutScrollService
  ) {}

  async ngOnInit() {
    this.estados = UF;
    await this.getConcessionarias();
    this.limparFormulario();
    this.habilitaOperacoes = SessionStorageService.habilitaOperacoes();
  }

  async getConcessionarias() {
    this.loading = true;
    await this.concessionariaService
      .get()
      .then((response: IResponseIntercace<IConcessionaria[]>) => {
        if (response.success) {
          this.source.load(response.data);
        } else {
          this.source.load([]);
        }       
        this.loading = false;
      });
  }

  private getConcessionaria(): IConcessionaria {
    return this.control.value as IConcessionaria;
  }

  onSelect(event): void {
    this.limparFormulario();
    const conc = event.data as IConcessionaria;
    this.control = this.formBuilder.group({
      id: conc.id,
      gestorId: conc.gestorId,
      ativo: conc.ativo,
      nome: conc.nome,
      estado: conc.estado,
    });
    this.edit = true;
    this.selected = true;
    this.scroolService.scrollTo(0,0);
  }

  async onDeleteConfirm() {
    this.dialogService
      .open(CustomDeleteConfirmationComponent)
      .onClose.subscribe(async (excluir) => {
        if (excluir) {
          await this.concessionariaService
          .delete(this.getConcessionaria().id)
          .then();
        {
          this.limparFormulario();
          this.alertService.showSuccess("Concessionária excluída com sucesso.");
          await this.getConcessionarias();
        }
        }
      });
  }

  onSubmit(): void {
    this.changeConcessionaria();
  }

  onClose(): void {
  }
  
  onEdit() {
    this.edit = !this.edit;
  }

  private async changeConcessionaria() {
    const concessionaria = this.getConcessionaria();
    if (concessionaria.id == null || concessionaria.id == "") {
      await this.post(concessionaria);
    } else {
      await this.put(concessionaria);
    }
  }

  private async post(concessionaria: IConcessionaria) {
    await this.concessionariaService.post(concessionaria).then(async (res: IResponseIntercace<IConcessionaria>) =>
    {
      this.onSelect(res);
      await this.getConcessionarias();
      this.alertService.showSuccess("Concessionária cadastrada com sucesso.");
    });
  }

  private async put(concessionaria: IConcessionaria) {
    await this.concessionariaService.put(concessionaria).then();
    {
      await this.getConcessionarias();
      this.alertService.showSuccess("Concessionária alterada com sucesso.");
    }
  }

  limparFormulario(): void {
    this.control.reset();
    this.edit = false;
    this.selected = false;
  }
}
