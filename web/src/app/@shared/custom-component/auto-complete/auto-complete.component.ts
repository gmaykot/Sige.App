import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IDropDown } from '../../../@core/data/drop-down';

@Component({
  selector: 'ngx-auto-complete',
  templateUrl: './auto-complete.component.html',
  styleUrls: ['./auto-complete.component.scss'],
})
export class AutoCompleteComponent {
  @Input() label: string = 'Selecione';
  @Input() editLabel: string = null;
  @Input() items: IDropDown[] = []; // Lista de objetos IDropDown
  @Output() itemSelected = new EventEmitter<IDropDown>(); // Evento ao selecionar

  searchControl = new FormControl(''); // Controle para entrada de texto
  filteredItems: IDropDown[] = []; // Resultados filtrados

  constructor() {
    // Atualiza os resultados filtrados conforme o usuário digita
    this.searchControl.valueChanges.subscribe((searchTerm: string) => {
      if (searchTerm && searchTerm.length >= 3) {
        this.filterItems(searchTerm);
      }
    });
  }

  // Filtra os itens com base no termo de busca
  filterItems(searchTerm: string) {
    if (!searchTerm) {
      this.filteredItems = [];
      return;
    }
    this.filteredItems = this.items.filter((item) =>
      item.descricao.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Emite o item selecionado e limpa a lista de sugestões
  selectItem(item: IDropDown) {
    this.searchControl.setValue(item.descricao, { emitEvent: false }); // Atualiza o input
    this.filteredItems = []; // Limpa a lista de sugestões
    this.itemSelected.emit(item); // Emite o item selecionado
  }
}
