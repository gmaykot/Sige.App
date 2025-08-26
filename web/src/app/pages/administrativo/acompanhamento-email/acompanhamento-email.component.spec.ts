import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcompanhamentoEmailComponent } from './acompanhamento-email.component';

describe('AcompanhamentoEmailComponent', () => {
  let component: AcompanhamentoEmailComponent;
  let fixture: ComponentFixture<AcompanhamentoEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcompanhamentoEmailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcompanhamentoEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
