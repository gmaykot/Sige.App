import { DatePipe } from "@angular/common";
import { Component, OnInit, Input } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { NbDialogRef, NbIconConfig } from "@nebular/theme";
import { LocalDataSource } from "ng2-smart-table";
import { IContatoEmail } from "../../../@core/data/email-data";
import { CheckboxComponent } from "../checkbox-component";
import { CustomDeleteConfirmationComponent } from "../custom-delete-confirmation.component";


@Component({
  selector: "ngx-envio-email-component",
  templateUrl: "./envio-email.component.html",
  styleUrls: ["./envio-email.component.scss"],
})
export class EnvioEmailComponent implements OnInit {
  constructor(
    protected dialogRef: NbDialogRef<CustomDeleteConfirmationComponent>,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe
  ) {}
  disabledIconConfig: NbIconConfig = { icon: "trash-2-outline", pack: "eva" };
  source: LocalDataSource = new LocalDataSource();

  settings = {
    columns: {
      id: {
        title: "",
        type: "custom",
        width: "8px",
        class: "checkbox",
        renderComponent: CheckboxComponent,
        onComponentInitFunction: (instance) => {
          instance.event.subscribe((row) => {
            this.onContatos(row);
          });
        },
      },
      nomeContato: {
        title: "Nome",
        type: "string",
        width: "10rem",
        filter: false,
      },
      emailContato: {
        title: "Email",
        type: "string",
        width: "10rem",
        filter: false,
      },
    },
    actions: false,
    pager: {
      display: true,
      perPage: 10,
    },
    hideSubHeader: true,
    noDataMessage: "Nenhum registro encontrado.",
  };

  public control = this.formBuilder.group({
    nomeContato: ["", Validators.required],
    emailContato: ["", Validators.required],
  });

  contatosChecked: IContatoEmail[] = [];
  @Input() contatos: Array<IContatoEmail> = [];
  id: number = 0;

  ngOnInit() {
    this.contatos.forEach(c => { c.tipoFornecedor = true; c.id = this.id; this.id++;});
    this.source.load(this.contatos);
  }

  cancel() {
    this.dialogRef.close();
  }

  submit() {
    this.dialogRef.close(this.contatosChecked);
  }

  onContatoConfirm() {
    var contato = this.control.value as IContatoEmail;
    contato.tipoFornecedor = false;
    contato.id = this.id;
    this.contatos.push(contato)
    this.source.load(this.contatos);
    this.id++;
    this.control.reset();
  }

  onContatoDelete(){
    this.contatosChecked.forEach(async contato => {
          this.contatos = this.contatos.filter(a => a.id != contato.id);
          this.source.load(this.contatos);         
          this.contatosChecked = [];    
    });
  }

  onContatos(data) {
    if (data.value) {
      this.contatosChecked.push(data.data);
    } else {
      this.contatosChecked = this.contatosChecked.filter(
        (a) => a.id != data.data.id
      );
    }
  }
}
