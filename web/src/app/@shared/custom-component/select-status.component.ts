import { Component, Input, OnInit } from "@angular/core";
import { IDropDown } from "../../@core/data/drop-down";
import { DatePipe } from "@angular/common";
import { FormControl } from "@angular/forms";

@Component({
  selector: 'select-status',
  template: `
    <nb-select fullWidth placeholder="Selecione">
        <nb-option>Selecione</nb-option>
        <nb-option>Completa</nb-option>
        <nb-option>Incompleta</nb-option>
        <nb-option>Valor Divergente</nb-option>
        <nb-option>Pendente Medição</nb-option>
        <nb-option>Erro na Leitura</nb-option>        
    </nb-select> 
  `,
})

export class SelectStatusComponent implements OnInit {

    ngOnInit(): void {
        
    }
}
