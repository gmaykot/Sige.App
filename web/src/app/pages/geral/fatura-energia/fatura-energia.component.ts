import { Component } from '@angular/core';
import { IDropDown } from '../../../@core/data/drop-down';
import { LocalDataSource } from 'ng2-smart-table';

@Component({
  selector: 'ngx-fatura-energia',
  templateUrl: './fatura-energia.component.html',
  styleUrls: ['./fatura-energia.component.scss']
})
export class FaturaEnergiaComponent {
  public empresas: Array<IDropDown> = []
  public concessionarias: Array<IDropDown> = []
  public editLabel: string = null;
  public source: LocalDataSource = new LocalDataSource();

  settings = {
    actions: {
      add: false,
      edit: false,
      delete: false,
    },
    columns: {
      empresa: {
        title: 'Lançamento',
        type: 'string',
      },
      concessionaria: {
        title: 'Valor (R$)',
        type: 'string',
      },
      valor: {
        title: 'Tipo',
        type: 'string',
      },
    },
    hideSubHeader: true,
    noDataMessage: "Nenhum registro encontrado.",
  }
  
  onItemSelected(selectedItem: IDropDown) {
  }

  selecionarColeta(event) {
    
  }
}
