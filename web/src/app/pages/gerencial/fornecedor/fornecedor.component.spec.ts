import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FornecedorComponent } from './fornecedor.component';

describe('FornecedorComponent', () => {
  let component: FornecedorComponent;
  let fixture: ComponentFixture<FornecedorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FornecedorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FornecedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
