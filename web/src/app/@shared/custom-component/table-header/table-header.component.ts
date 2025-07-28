import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SessionStorageService } from '../../../@core/services/util/session-storage.service';

@Component({
  selector: 'ngx-table-header',
  templateUrl: './table-header.component.html',
  styleUrls: ['./table-header.component.scss']
})
export class TableHeaderComponent {
  
  @Input() showActions: boolean = false;
  @Input() showHelp: boolean = false;
  @Input() title: string = '';
  @Output() editCustom = new EventEmitter();
  @Output() helpCustom = new EventEmitter();

  showTableActions(): boolean {
    return this.showActions && SessionStorageService.habilitaOperacoes();
  }

  edit(){
    this.editCustom.emit();
  }

  help(){
    this.helpCustom.emit();
  }
}
