import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemeService } from '../../../shared/services/theme.service';
import { PantallaUsuario } from './pantalla-usuario';

/** Pruebas de la pantalla de perfil: creación del componente con el tema claro. */
describe('PantallaUsuario', () => {
  let component: PantallaUsuario;
  let fixture: ComponentFixture<PantallaUsuario>;

  beforeEach(async () => {
    // Configura el entorno de pruebas con la pantalla de perfil.
    await TestBed.configureTestingModule({
      imports: [PantallaUsuario],
    }).compileComponents();

    // Fuerza el modo claro antes de cada prueba.
    TestBed.inject(ThemeService).setDarkMode(false);

    // Crea la instancia del componente bajo prueba.
    fixture = TestBed.createComponent(PantallaUsuario);
    // Expone la clase TypeScript del componente.
    component = fixture.componentInstance;
    // Espera a que la vista termine de estabilizarse.
    await fixture.whenStable();
  });

  it('should create', () => {
    // Comprueba que el componente se ha creado correctamente.
    expect(component).toBeTruthy();
  });
});
