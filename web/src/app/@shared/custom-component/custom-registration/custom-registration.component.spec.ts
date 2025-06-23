import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomRegistrationComponent } from './custom-registration.component';

describe('CustomRegistrationComponent', () => {
  let component: CustomRegistrationComponent;
  let fixture: ComponentFixture<CustomRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomRegistrationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
