import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalarioMinimoComponent } from './salario-minimo.component';

describe('SalarioMinimoComponent', () => {
  let component: SalarioMinimoComponent;
  let fixture: ComponentFixture<SalarioMinimoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalarioMinimoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalarioMinimoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
