import { Component, Input, OnInit } from "@angular/core";
import { IDropDown } from "../../@core/data/drop-down";
import { DatePipe } from "@angular/common";
import { FormControl } from "@angular/forms";

@Component({
  selector: 'ngx-select-periodo',
  template: `
    <nb-select fullWidth placeholder="Selecione">
        <nb-option *ngFor="let mes of meses" value="{{mes.id}}">{{mes.descricao}}</nb-option>
    </nb-select> 
  `,
})

export class SelectPeriodoComponent implements OnInit {

    @Input() qtdeMeses: number = 6;
    @Input() format: string = 'MM/yyyy';
    @Input() formControlName: string;
    @Input() dataInicial: Date = new Date();
    @Input() decrescente: boolean = true;
    @Input() control: FormControl;

    meses: Array<IDropDown> = [];

    ngOnInit() {
        var pipe = new DatePipe('pt-BR');
        var operator = this.decrescente ? -1 : +1;
        for(var i = 1; i <= this.qtdeMeses; i++) {
            this.meses.push(
            { 
                id: pipe.transform(this.dataInicial.setMonth(this.dataInicial.getMonth()+(operator+i)), '01/MM/yyyy'), 
                descricao: pipe.transform(this.dataInicial.setMonth(this.dataInicial.getMonth()+(operator*i)), this.format)
            });
        }
    }
}
