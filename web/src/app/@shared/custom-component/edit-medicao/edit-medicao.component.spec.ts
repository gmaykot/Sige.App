import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMedicaoComponent } from './edit-medicao.component';

describe('EditMedicaoComponent', () => {
  let component: EditMedicaoComponent;
  let fixture: ComponentFixture<EditMedicaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditMedicaoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditMedicaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
