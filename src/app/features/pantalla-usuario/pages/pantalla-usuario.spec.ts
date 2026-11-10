import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemeService } from '../../../shared/services/theme.service';
import { PantallaUsuario } from './pantalla-usuario';

describe('PantallaUsuario', () => {
  let component: PantallaUsuario;
  let fixture: ComponentFixture<PantallaUsuario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PantallaUsuario],
    }).compileComponents();

    TestBed.inject(ThemeService).setDarkMode(false);

    fixture = TestBed.createComponent(PantallaUsuario);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
