import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatorioEconomiaComponent } from './relatorio-economiacomponent';

describe('RelatorioMensalComponent', () => {
  let component: RelatorioEconomiaComponent;
  let fixture: ComponentFixture<RelatorioEconomiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RelatorioEconomiaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RelatorioEconomiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
