import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaturaEnergiaComponent } from './fatura-energia.component';

describe('FaturaEnergiaComponent', () => {
  let component: FaturaEnergiaComponent;
  let fixture: ComponentFixture<FaturaEnergiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FaturaEnergiaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FaturaEnergiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
