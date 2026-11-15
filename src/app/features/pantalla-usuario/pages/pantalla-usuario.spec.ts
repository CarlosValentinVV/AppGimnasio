import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AUTENTICACION } from '../../../core/auth/autenticacion.token';
import type { ServicioAutenticacion, UsuarioPublico } from '../../../core/auth/autenticacion.model';
import { ThemeService } from '../../../shared/services/theme.service';
import { PantallaUsuario } from './pantalla-usuario';

/** Sesión de prueba usada para comprobar que el perfil muestra los datos del usuario. */
const SESION: UsuarioPublico = {
  nombre: 'Izan García Iglesias',
  email: 'izan@ejemplo.com',
  fechaNacimiento: '1998-03-15',
};

/** Implementación mínima del servicio de autenticación para las pruebas del perfil. */
const AUTH_FALSA: ServicioAutenticacion = {
  // El perfil no registra usuarios; se deja sin implementar.
  registrar: () => Promise.reject(new Error('No usado en estas pruebas')),
  // El perfil no inicia sesión; se deja sin implementar.
  iniciarSesion: () => Promise.reject(new Error('No usado en estas pruebas')),
  // El perfil no cierra sesión; se deja sin implementar.
  cerrarSesion: () => undefined,
  // Devuelve siempre la sesión de prueba.
  usuarioActual: () => SESION,
};

/** Pruebas de la pantalla de perfil: creación del componente y datos del usuario. */
describe('PantallaUsuario', () => {
  let component: PantallaUsuario;
  let fixture: ComponentFixture<PantallaUsuario>;

  beforeEach(async () => {
    // Configura el entorno de pruebas con la pantalla de perfil y una sesión abierta.
    await TestBed.configureTestingModule({
      imports: [PantallaUsuario],
      providers: [{ provide: AUTENTICACION, useValue: AUTH_FALSA }],
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

  it('debe mostrar el nombre del usuario que tiene la sesión abierta', () => {
    // Recupera el DOM renderizado del perfil.
    const compiled = fixture.nativeElement as HTMLElement;

    // La cabecera debe mostrar el nombre de la sesión y sus iniciales.
    expect(compiled.querySelector('.nombre-usuario')?.textContent).toContain('Izan García Iglesias');
    expect(compiled.querySelector('.avatar-grande')?.textContent).toContain('IG');
  });
});
