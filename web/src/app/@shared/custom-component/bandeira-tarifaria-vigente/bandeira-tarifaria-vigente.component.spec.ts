import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BandeiraTarifariaVigenteComponent } from './bandeira-tarifaria-vigente.component';

describe('BandeiraTarifariaVigenteComponent', () => {
  let component: BandeiraTarifariaVigenteComponent;
  let fixture: ComponentFixture<BandeiraTarifariaVigenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BandeiraTarifariaVigenteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BandeiraTarifariaVigenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
