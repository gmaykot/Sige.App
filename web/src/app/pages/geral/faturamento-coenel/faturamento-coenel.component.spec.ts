import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaturamentoCoenelComponent } from './faturamento-coenel.component';

describe('FaturamentoCoenelComponent', () => {
  let component: FaturamentoCoenelComponent;
  let fixture: ComponentFixture<FaturamentoCoenelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FaturamentoCoenelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FaturamentoCoenelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
