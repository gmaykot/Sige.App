import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteActionLinkComponent } from './delete-action-link.component';

describe('DeleteActionLinkComponent', () => {
  let component: DeleteActionLinkComponent;
  let fixture: ComponentFixture<DeleteActionLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteActionLinkComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteActionLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
