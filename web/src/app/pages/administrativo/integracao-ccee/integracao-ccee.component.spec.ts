import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntegracaoCceeComponent } from './integracao-ccee.component';

describe('IntegracaoCceeComponent', () => {
  let component: IntegracaoCceeComponent;
  let fixture: ComponentFixture<IntegracaoCceeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntegracaoCceeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntegracaoCceeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
