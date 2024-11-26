import { Component, OnInit, Input, EventEmitter, Output, Optional } from "@angular/core";
import { NbDialogRef, NbDialogService } from "@nebular/theme";
import { ContatosSettings } from "./contato.subcomponent.settings";
import { LocalDataSource } from "ng2-smart-table";
import { IContato } from "../../../@core/data/contato";
import { IResponseIntercace } from "../../../@core/data/response.interface";
import { ContatoComponent } from "../contato.component";
import { ContatoService } from "../../../@core/services/gerencial/contato.service";
import { CustomDeleteConfirmationComponent } from "../custom-delete-confirmation.component";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: "ngx-subcontato-component",
  templateUrl: "./contato.subcomponent.html",
  styleUrls: ["./contato.subcomponent.scss"],
})
export class ListaContatoComponent extends ContatosSettings implements OnInit {
  @Input() contatos: Array<IContato> = [];
  @Input() fornecedorId?: string;
  @Input() empresaId?: string;
  @Output() alertEvent = new EventEmitter();
  @Output() refreshEvent = new EventEmitter();
  
  public source: LocalDataSource = new LocalDataSource();
  public loading: boolean = false;

  constructor(
    @Optional() protected dialogRef: NbDialogRef<ContatoComponent>,
    private dialogService: NbDialogService,
    private contatoService: ContatoService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.source.load(this.contatos);
  }

  onClear(): void {
    this.checked = [];
    this.loading = false;
  }

  onCreate(): void
  {
    this.onClear();
    this.dialogService
    .open(ContatoComponent, { context: { contato: { fornecedorId: this.fornecedorId, empresaId: this.empresaId } as IContato }, })
    .onClose.subscribe(async (ret: IContato) => {
      if (ret) {
        await this.contatoService.post(ret).then(async (res: IResponseIntercace<IContato>) =>
        {
          this.source.append(ret);
          this.alertEvent.emit({ message: "Contrato cadastrado com sucesso.", type: 'success' });
          this.refreshEvent.emit(true);
        }).catch(async (res: HttpErrorResponse ) =>
            {
                this.alertEvent.emit(res.message);
                this.refreshEvent.emit(false);      
            });
      } else 
      {
        this.alertEvent.emit({ message: "Erro ao cadastrar contato.", type: 'danger' });
        this.refreshEvent.emit(false);      
      }
    });
  }

  onEdit(): void 
  {
    if (this.checked && this.checked.length > 0)
        {
          var contato = this.checked.pop();
            this.dialogService
            .open(ContatoComponent, { context: { contato: contato }, })
            .onClose.subscribe(async (ret: IContato) => {
              if (ret) {
                await this.contatoService.put(ret).then(async (res: IResponseIntercace<IContato>) =>
                {
                  this.source.update(contato, res);
                  this.alertEvent.emit({ message: "Contrato atualizado com sucesso.", type: 'success' });
                  this.refreshEvent.emit(true);
                }).catch(async (res: IResponseIntercace<any>) =>
                    {
                        this.alertEvent.emit(res.errors?.map((x) => `- ${x.value}`).join("<br>"));
                        this.refreshEvent.emit(false);      
                    });
              } else 
              {
                this.alertEvent.emit({ message: "Erro ao cadastrar contato.", type: 'danger' });
                this.refreshEvent.emit(false);      
              }
              this.onClear();
            });
        }
  }

  onDelete(): void 
  {
    if (this.checked && this.checked.length > 0)
    {
        this.dialogService
        .open(CustomDeleteConfirmationComponent, { context: { mesage: 'Deseja excluir os contatos selecionados?'} })
        .onClose.subscribe(async (excluir) => {
          if (excluir) {
            this.checked.forEach(async contato => {
              await this.contatoService.delete(contato.id).then()
              {              
                this.source.remove(contato);
              };
            });
            this.alertEvent.emit({ message: "Contrato excluído com sucesso.", type: 'success' });
          }
        });
        this.onClear();
    }
  }
}
