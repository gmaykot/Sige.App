import { Component, Input, OnInit } from '@angular/core';
import { NbSortDirection, NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';
import { EmailService } from '../../../@core/services/util/email.service';

interface TreeNode<T> {
  data?: T;
  children?: TreeNode<T>[];
  expanded?: boolean;
}

interface FSEntry {
  mesReferencia?: string;
  grupoEmpresa?: string;
  dataEnvio?: string;
  dataAbertura?: string;
  usuario?: string;
  tipo?: string;
  aberto?: string;
  observacao?: string;
  qtdItens?: number;
}

@Component({
  selector: "ngx-acompanhamento-email",
  templateUrl: "./acompanhamento-email.component.html",
  styleUrls: ["./acompanhamento-email.component.scss"],
})
export class AcompanhamentoEmailComponent implements OnInit {

  ngOnInit(): void {
    this.emailService.getHistorico()
    .then( (response: any) =>
    {
      if (response.success)
      {
        this.dataSource = this.dataSourceBuilder.create(response.data);
      }
    });
  }
  
  columnHeaders: { [key: string]: string } = {
    mesReferencia: 'Mês Referência',
    grupoEmpresa: 'Grupo Empresa',
    dataEnvio: 'Data Envio',
    dataAbertura: 'Data Abertura',
    usuario: 'Usuário',
    aberto: 'Aberto',
    observacao: 'Observação',
    qtdItens: 'Qtd. Itens',
  };

  customColumn = 'mesReferencia';
  defaultColumns = [ 'grupoEmpresa', 'dataEnvio', 'dataAbertura', 'usuario', 'qtdItens'];
  allColumns = [this.customColumn, ...this.defaultColumns];

  dataSource: NbTreeGridDataSource<FSEntry>;

  sortColumn: string;
  sortDirection: NbSortDirection = NbSortDirection.NONE;

  constructor(private dataSourceBuilder: NbTreeGridDataSourceBuilder<FSEntry>, private emailService: EmailService) {
    
  }

  getDirection(column: string): NbSortDirection {
    if (column === this.sortColumn) {
      return this.sortDirection;
    }
    return NbSortDirection.NONE;
  }

  private data: TreeNode<FSEntry>[] = [];

  getShowOn(index: number) {
    const minWithForMultipleColumns = 400;
    const nextColumnStep = 100;
    return minWithForMultipleColumns + nextColumnStep * index;
  }
}

@Component({
  selector: 'ngx-fs-icon',
  template: `
    <nb-tree-grid-row-toggle [expanded]="expanded" *ngIf="isDir(); else fileIcon">
    </nb-tree-grid-row-toggle>
    <ng-template #fileIcon>
      <nb-icon icon="file-text-outline"></nb-icon>
    </ng-template>
  `,
})
export class FsIconComponent {
  @Input() kind: string;
  @Input() expanded: boolean;

  isDir(): boolean {
    return this.kind === 'dir';
  }
}
