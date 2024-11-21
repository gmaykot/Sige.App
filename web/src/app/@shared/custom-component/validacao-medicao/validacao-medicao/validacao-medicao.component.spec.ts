import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidacaoMedicaoComponent } from './validacao-medicao.component';

describe('ValidacaoMedicaoComponent', () => {
  let component: ValidacaoMedicaoComponent;
  let fixture: ComponentFixture<ValidacaoMedicaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidacaoMedicaoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValidacaoMedicaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
