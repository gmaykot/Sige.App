import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatorioMedicaoComponent } from './relatorio-medicao.component';

describe('RelatorioMedicaoComponent', () => {
  let component: RelatorioMedicaoComponent;
  let fixture: ComponentFixture<RelatorioMedicaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RelatorioMedicaoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RelatorioMedicaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
