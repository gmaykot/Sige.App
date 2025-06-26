import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'ngx-valor-mensal-ponto-medicao',
  templateUrl: './valor-mensal-ponto-medicao.component.html',
  styleUrls: ['./valor-mensal-ponto-medicao.component.scss']
})
export class ValorMensalPontoMedicaoComponent {
  public edit: boolean = false;
  public settings: any;
  public source: any;
  public control: FormGroup;

  onItemSelected(){}
  onSubmitCustom(){}
  onDelete(){}
  clearForm(){}
  onSelectCustom($event){}
  onEdit(){}
  onHelp(){}
}
