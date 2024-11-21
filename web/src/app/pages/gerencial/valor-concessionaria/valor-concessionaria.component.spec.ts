import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValorConcessionariaComponent } from './valor-concessionaria.component';

describe('ValorConcessionariaComponent', () => {
  let component: ValorConcessionariaComponent;
  let fixture: ComponentFixture<ValorConcessionariaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValorConcessionariaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValorConcessionariaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
