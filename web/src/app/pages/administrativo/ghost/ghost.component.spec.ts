import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GhostComponent } from './ghost.component';

describe('GhostComponent', () => {
  let component: GhostComponent;
  let fixture: ComponentFixture<GhostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GhostComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GhostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
