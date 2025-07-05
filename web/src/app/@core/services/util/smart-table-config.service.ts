import { Injectable } from '@angular/core';
import { StatusIconComponent } from '../../../@shared/custom-component/status-icon/status-icon.component';
import { SEGMENTO, TIPO_CONEXAO } from '../../enum/status-contrato';
import { DefaultService } from '../default-service';

@Injectable({ providedIn: 'root' })
export class SmartTableConfigService {
  generateTableSettingsFromObject<T extends object>(
    exampleObj: T,
    options?: {
      exibirStatus?: boolean;
      permitirDelete?: boolean;
    },
    service?: DefaultService<T>
  ) {
    const columns: any = {};
    // Adiciona coluna status automaticamente se solicitado
    if (options?.exibirStatus) {
      columns['status'] = {
        title: "",
        type: "custom",
        width: "8px",
        filter: false,
        renderComponent: StatusIconComponent,
        onComponentInitFunction: (instance: StatusIconComponent) => {
          instance.service = service;
        },
      };
    }

    for (const key in exampleObj) {
      
      if (!exampleObj.hasOwnProperty(key)) continue;
      if (key === 'id') continue;
      if (key === 'status' && options?.exibirStatus) continue;

      const value = exampleObj[key];

      columns[key] = {
        title: this.formatTitle(key),
        type: this.detectType(value),
        ...this.getDefaultPrepareFunctions(value, key),
      };
    }

    return {
      add: {
        addButtonContent: '<i class="nb-plus"></i>',
        createButtonContent: '<i class="nb-checkmark"></i>',
        cancelButtonContent: '<i class="nb-close"></i>',
      },
      edit: {
        editButtonContent: '<i class="nb-gear"></i>',
        saveButtonContent: '<i class="nb-checkmark"></i>',
        cancelButtonContent: '<i class="nb-close"></i>',
        confirmSave: true,
      },
      delete: {
        deleteButtonContent: '<i class="nb-edit"></i>',
        confirmDelete: true,
      },
      actions: {
        add: false,
        edit: false,
        delete: options?.permitirDelete ?? false,
        position: 'right',
        columnTitle: '',
      },
      columns,
      hideSubHeader: true,
      noDataMessage: 'Nenhum registro encontrado.',
    };
  }

  private detectType(value: any): string {
    if (typeof value === 'number') return 'number';
    if (typeof value === 'boolean') return 'string';
    if (value instanceof Date) return 'string';
    return 'string';
  }

  private getDefaultPrepareFunctions(value: any, key: string): Partial<any> {
    const lookupMaps: Record<string, { id: number; desc: string }[]> = {
      segmento: SEGMENTO,
      subGrupo: TIPO_CONEXAO,
    };
    
    if (lookupMaps[key]) {
      return {
        valuePrepareFunction: (val: number) =>
          lookupMaps[key].find((item) => item.id === val)?.desc ?? val,
      };
    }

    if (typeof value === 'boolean') {
      return {
        valuePrepareFunction: (val: boolean) =>
          val ? 'Sim' : 'Não',
      };
    }

    if (typeof value === 'number') {
      return {
        valuePrepareFunction: (val: number) =>
          Intl.NumberFormat('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(val),
      };
    }

    if (value instanceof Date || this.isDateString(value)) {
      return {
        valuePrepareFunction: (val: string | Date) => {
          const date = val instanceof Date ? val : new Date(val);
          if (isNaN(date.getTime())) return val;
          return date.toLocaleDateString('pt-BR');
        },
      };
    }

    return {};
  }

  private isDateString(value: any): boolean {
    return (
      typeof value === 'string' &&
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)
    );
  }

  private formatTitle(key: string): string {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase());
  }
}