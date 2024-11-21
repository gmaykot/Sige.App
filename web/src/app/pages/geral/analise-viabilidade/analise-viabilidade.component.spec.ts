import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnaliseViabilidadeComponent } from './analise-viabilidade.component';

describe('AnaliseViabilidadeComponent', () => {
  let component: AnaliseViabilidadeComponent;
  let fixture: ComponentFixture<AnaliseViabilidadeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnaliseViabilidadeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnaliseViabilidadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
