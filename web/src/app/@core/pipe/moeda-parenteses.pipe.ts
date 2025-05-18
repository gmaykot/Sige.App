// moeda-parenteses.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'moedaParenteses'
})
export class MoedaParentesesPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    if (value == null) return '-';

    const absValue = Math.abs(value);
    const formatted = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(absValue);

    return value < 0 ? `(${formatted})` : formatted;
  }
}
