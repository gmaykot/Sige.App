import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { IDropDown } from '../../../@core/data/drop-down';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'ngx-auto-complete',
  templateUrl: './auto-complete.component.html',
  styleUrls: ['./auto-complete.component.scss'],
})
export class AutoCompleteComponent implements OnInit {
  @Input() label: string = 'Selecione';
  @Input() placeholder: string = 'Pesquise pelo nome...';
  @Input() editLabel: string = null;
  @Input() required: boolean = false;
  @Input() items: IDropDown[] = []; // Lista de objetos IDropDown
  @Output() itemSelected = new EventEmitter<IDropDown>(); // Evento ao selecionar
  options: string[];
  filteredControlOptions$: Observable<string[]>;

  public control = this.formBuilder.group({
    id: ["", Validators.required],
    items: ["", Validators.required]
  });

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    if (this.editLabel) {
      var filter = this.items.filter(i => i.descricao === this.editLabel);
      this.control.patchValue({ items: filter[0]?.descricao });
    }
    this.getValores();
  }

  // Filtra os itens com base no termo de busca
getValores() {
    this.options = this.items.map((x: any) => x.descricao);
    this.filteredControlOptions$ = of(this.options);

    const idMap = new Map(this.items.map(x => [x.descricao, x.id]));

    this.filteredControlOptions$ = this.control.get('items').valueChanges
      .pipe(
        startWith(''),
        map(filterString => this.filter(filterString)),
      );

    this.control.get('items').valueChanges.subscribe(value => {
      const id = idMap.get(value);
      if (id) {
        this.control.patchValue({ id: id }, { emitEvent: false });
      }
    });
  }

  private filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(optionValue => optionValue.toLowerCase().includes(filterValue));
  }

  onOptionSelected(option: any): void {
    var filter = this.items.filter(i => i.descricao === option);
    this.itemSelected.emit(filter[0]); // Emite o item selecionado
  }
}
