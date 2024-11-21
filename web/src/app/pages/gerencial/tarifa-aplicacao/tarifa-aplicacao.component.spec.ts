import { ComponentFixture, TestBed } from '@angular/core/testing';

import TarifaAplicacaoComponent from './tarifa-aplicacao.component';

describe('TarifaAplicacaoComponent', () => {
  let component: TarifaAplicacaoComponent;
  let fixture: ComponentFixture<TarifaAplicacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TarifaAplicacaoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TarifaAplicacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
