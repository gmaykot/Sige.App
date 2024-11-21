import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValorPadraoComponent } from './valor-padrao.component';

describe('ValorPadraoComponent', () => {
  let component: ValorPadraoComponent;
  let fixture: ComponentFixture<ValorPadraoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValorPadraoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValorPadraoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
