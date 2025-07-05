import { Component, OnInit, Input, EventEmitter, Output, Optional, OnChanges, SimpleChanges } from "@angular/core";
import { NbDialogRef, NbDialogService } from "@nebular/theme";
import { LocalDataSource } from "ng2-smart-table";
import { IContato } from "../../../@core/data/contato";
import { IResponseInterface } from "../../../@core/data/response.interface";
import { ContatoComponent } from "../contato.component";
import { ContatoService } from "../../../@core/services/gerencial/contato.service";
import { CustomDeleteConfirmationComponent } from "../custom-delete-confirmation.component";
import { HttpErrorResponse } from "@angular/common/http";
import { SmartTableConfigService } from "../../../@core/services/util/smart-table-config.service";

@Component({
  selector: "ngx-subcontato-component",
  templateUrl: "./contato.subcomponent.html",
  styleUrls: ["./contato.subcomponent.scss"],
})
export class ListaContatoComponent implements OnInit, OnChanges {
  @Input() contatos: Array<IContato> = [];
  @Input() fornecedorId?: string;
  @Input() empresaId?: string;
  @Output() alertEvent = new EventEmitter();
  @Output() refreshEvent = new EventEmitter();
  
  public source: LocalDataSource = new LocalDataSource();
  public loading: boolean = false;
  public settings: any;

  constructor(
    @Optional() protected dialogRef: NbDialogRef<ContatoComponent>,
    private dialogService: NbDialogService,
    private contatoService: ContatoService,
    private smartService: SmartTableConfigService
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['contatos']) {
      this.source.load(this.contatos);
    }    
  }

  ngOnInit(): void {
    this.settings = this.smartService.generateTableSettingsFromObject(IContato.SourceInstance(), {
      exibirStatus: true,
      permitirDelete: true,
    }, this.contatoService);

    this.source.load(this.contatos);
  }

  onClear(): void {
    this.loading = false;
  }

  onCreate(): void {
    this.onClear();
  
    const context = {
      contato: {
        fornecedorId: this.fornecedorId,
        empresaId: this.empresaId
      } as IContato
    };
  
    this.dialogService
      .open(ContatoComponent, { context })
      .onClose.subscribe(async (ret: { contato: IContato; delete: boolean }) => {
        if (!ret?.contato) {
          this.refreshEvent.emit(null);
          return;
        }
  
        try {
          if (ret.delete) {
            await this.contatoService.delete(ret.contato.id);
            this.source.remove(ret.contato);
            this.alertEvent.emit({ message: "Contato excluído com sucesso.", type: 'success' });
          } else {
            await this.contatoService.post(ret.contato);
            this.source.append(ret.contato);
            this.alertEvent.emit({ message: `Contato ${ret.contato.id ? 'atualizado' : 'cadastrado'} com sucesso.`, type: 'success' });
          }
  
          this.refreshEvent.emit(this.contatoService?.constructor?.name);
        } catch (error) {
          const message = error instanceof HttpErrorResponse ? error.message : 'Erro inesperado';
          this.alertEvent.emit(message);
          this.refreshEvent.emit(null);
        }
      });
  }

  onEdit(event: any): void {
    if (!event?.data) return;
  
    const contato = event.data;
  
    this.dialogService
      .open(ContatoComponent, { context: { contato } })
      .onClose.subscribe(async (ret: { contato: IContato; delete: boolean }) => {
        if (!ret?.contato) {
          this.refreshEvent.emit(null);
          this.onClear();
          return;
        }
  
        try {
          if (ret.delete) {
            await this.contatoService.delete(ret.contato.id);
            this.source.remove(ret.contato);
            this.alertEvent.emit({ message: "Contato excluído com sucesso.", type: 'success' });
          } else {
            const response = await this.contatoService.put(ret.contato);
            this.source.update(contato, response);
            this.alertEvent.emit({ message: "Contato atualizado com sucesso.", type: 'success' });
          }

          this.refreshEvent.emit(this.contatoService?.constructor?.name);
        } catch (error: any) {
          const message = error?.errors?.map((x: any) => `- ${x.value}`).join("<br>") || 'Erro ao atualizar contato.';
          this.alertEvent.emit(message);
          this.refreshEvent.emit(null);
        }
  
        this.onClear();
      });
  }
  
}
