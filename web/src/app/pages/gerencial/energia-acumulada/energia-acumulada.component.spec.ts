import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnergiaAcumuladaComponent } from './energia-acumulada.component';

describe('EnergiaAcumuladaComponent', () => {
  let component: EnergiaAcumuladaComponent;
  let fixture: ComponentFixture<EnergiaAcumuladaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnergiaAcumuladaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnergiaAcumuladaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
