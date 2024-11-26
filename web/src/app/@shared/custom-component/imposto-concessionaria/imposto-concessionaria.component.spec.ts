import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImpostoConcessionariaComponent } from './imposto-concessionaria.component';

describe('ImpostoConcessionariaComponent', () => {
  let component: ImpostoConcessionariaComponent;
  let fixture: ComponentFixture<ImpostoConcessionariaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImpostoConcessionariaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImpostoConcessionariaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
