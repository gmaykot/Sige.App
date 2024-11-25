import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BandeiraTarifariaComponent } from './bandeira-tarifaria.component';

describe('BandeiraTarifariaComponent', () => {
  let component: BandeiraTarifariaComponent;
  let fixture: ComponentFixture<BandeiraTarifariaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BandeiraTarifariaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BandeiraTarifariaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
