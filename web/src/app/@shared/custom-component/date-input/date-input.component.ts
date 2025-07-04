/* eslint-disable @angular-eslint/component-selector */
import { DatePipe } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-date-input',
  templateUrl: './date-input.component.html',
  styleUrls: ['./date-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateInputComponent),
      multi: true
    }
  ]
})
export class DateInputComponent implements ControlValueAccessor, AfterViewInit {
  @Input() full: 'true' | 'false' = 'true'; // Tipo de formato de data
  @Input() fieldSize: 'small' | 'medium' = 'medium'; // Tipo de formato de data

  public dateValue: string = '';

  onChange = (value: any) => {};
  onTouched = () => {};

  constructor(private cd: ChangeDetectorRef, private datePipe: DatePipe) {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.cd.detectChanges(); // Força a detecção de mudanças após inicialização completa
    }, 0);
  }

  // Função para escrever o valor no campo (do ControlValueAccessor)
  writeValue(value: any): void {    
    setTimeout(() => {
      if (value) {
        this.dateValue = value;
        this.cd.markForCheck();
      }
      this.cd.detectChanges();
    }, 0);
  }

  // Função para registrar o método onChange (do ControlValueAccessor)
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  // Função para registrar o método onTouched (do ControlValueAccessor)
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // Função que é chamada sempre que o usuário altera o valor do input
  onInputChange(event: any): void {
    const newValue = event.target.value;
    this.dateValue = newValue;
    this.onChange(newValue);
  }

  // Função para tratar o evento de "blur" (quando o campo perde o foco)
  onBlur(): void {
    this.onTouched();
  }
}
