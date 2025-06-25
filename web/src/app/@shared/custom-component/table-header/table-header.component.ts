import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SessionStorageService } from '../../../@core/services/util/session-storage.service';

@Component({
  selector: 'ngx-table-header',
  templateUrl: './table-header.component.html',
  styleUrls: ['./table-header.component.scss']
})
export class TableHeaderComponent implements OnInit{
  
  ngOnInit(): void {
  }

  @Input() showActions: boolean = false;
  @Input() showHelp: boolean = false;
  @Input() title: string = '';
  @Output() onEdit = new EventEmitter();
  @Output() onHelp = new EventEmitter();

  showTableActions(): boolean {
    return this.showActions && SessionStorageService.habilitaOperacoes();
  }

  edit(){
    this.onEdit.emit();
  }

  help(){
    this.onHelp.emit();
  }
}
