import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuSistemaComponent } from './menu-sistema.component';

describe('MenuSistemaComponent', () => {
  let component: MenuSistemaComponent;
  let fixture: ComponentFixture<MenuSistemaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuSistemaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuSistemaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
