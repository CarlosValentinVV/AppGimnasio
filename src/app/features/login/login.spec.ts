import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter, Router } from '@angular/router';

import { AUTENTICACION } from '../../core/auth/autenticacion.token';
import type {
  DatosRegistro,
  ServicioAutenticacion,
  UsuarioPublico,
} from '../../core/auth/autenticacion.model';
import { Login } from './login';

/** Pruebas unitarias del componente de acceso: estado, alternancia de pestañas y DOM. */
describe('Login Component (Pruebas Unitarias)', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;

  // Configuración del entorno antes de cada especificación (it)
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Al ser un Standalone Component, se añade en 'imports' y no en 'declarations'
      imports: [Login],
      // El componente navega al perfil, así que necesita el router.
      providers: [provideRouter([{ path: 'perfil', children: [] }])],
    }).compileComponents();

    // Creamos la instancia del fixture (el entorno del componente)
    fixture = TestBed.createComponent(Login);

    // Accedemos a la instancia de la clase TypeScript del componente
    component = fixture.componentInstance;

    // Renderizamos el componente por primera vez
    fixture.detectChanges();
  });

  // 1. PRUEBAS DE LA CLASE (LÓGICA INTERNA)

  it('debe crearse correctamente la instancia del componente', () => {
    // Evalúa que el componente no sea nulo ni indefinido
    expect(component).toBeTruthy();
  });

  it('debe inicializarse con el modo de acceso en "login" por defecto', () => {
    // Comprobamos el estado inicial de la propiedad 'modo'
    expect(component.modo).toBe('login');
  });

  it('debe cambiar el estado de la propiedad "modo" al invocar cambiarModo()', () => {
    // Actuamos directamente sobre el método de la clase
    component.cambiarModo('registro');

    // Verificamos que el estado interno cambió correctamente
    expect(component.modo).toBe('registro');
  });

  // 2. PRUEBAS DEL DOM (INTERFAZ DE USUARIO)

  it('debe mostrar el formulario de Login y ocultar el de Registro al iniciar', () => {
    // Obtenemos el elemento compilado del HTML
    const compiled = fixture.nativeElement as HTMLElement;

    // Buscamos los formularios por sus identificadores únicos
    const inputEmailLogin = compiled.querySelector('#login-email');
    const inputNombreRegistro = compiled.querySelector('#registro-nombre');

    // Comprobamos el comportamiento esperado por las directivas *ngIf
    expect(inputEmailLogin).toBeTruthy(); // Debe existir en el DOM
    expect(inputNombreRegistro).toBeFalsy(); // NO debe existir en el DOM
  });

  it('debe alternar la visibilidad de los formularios en el DOM al cambiar el modo a "registro"', () => {
    // 1. Modificamos la propiedad interna
    component.cambiarModo('registro');

    // 2. NOTA: Notificamos al HTML que hubo cambios en la clase para que se vuelva a renderizar
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const inputEmailLogin = compiled.querySelector('#login-email');
    const inputNombreRegistro = compiled.querySelector('#registro-nombre');

    // Ahora el resultado debe ser el inverso debido al cambio de estado
    expect(inputEmailLogin).toBeFalsy();
    expect(inputNombreRegistro).toBeTruthy();
  });

  it('debe aplicar la clase CSS de pestaña activa al botón correspondiente', () => {
    // Usamos By.css para buscar elementos de forma más nativa en Angular
    const botones = fixture.debugElement.queryAll(By.css('.acceso__pestaña'));

    // Obtenemos el elemento HTML nativo de cada botón del array
    const botonLogin = botones[0].nativeElement as HTMLButtonElement;
    const botonRegistro = botones[1].nativeElement as HTMLButtonElement;

    expect(botonLogin.classList.contains('acceso__pestaña--activa')).toBe(true);
    expect(botonRegistro.classList.contains('acceso__pestaña--activa')).toBe(false);
  });

  it('debe cambiar de modo automáticamente cuando el usuario hace clic en la pestaña "Registrarse"', () => {
    // Buscamos el segundo botón empleando selectores CSS avanzados
    const botonRegistroDebug = fixture.debugElement.queryAll(By.css('.acceso__pestaña'))[1];

    // Simulamos el evento click real del usuario en la interfaz
    botonRegistroDebug.triggerEventHandler('click', null);

    // Forzamos la actualización del árbol visual
    fixture.detectChanges();

    // Verificamos que la acción del DOM modificó exitosamente la propiedad de la clase
    expect(component.modo).toBe('registro');
  });
});

/**
 * Crea una implementación falsa del servicio de autenticación.
 *
 * Permite comprobar el flujo completo del componente sin depender de
 * `localStorage`, `sessionStorage` ni de la criptografía del navegador.
 */
function crearAuthFalsa(usuarioInicial: UsuarioPublico | null = null): ServicioAutenticacion {
  // Sesión que mantiene la implementación falsa entre llamadas.
  let sesion = usuarioInicial;

  return {
    // Registrar la cuenta abre la sesión con los datos introducidos.
    registrar: async (datos: DatosRegistro) => {
      const usuario: UsuarioPublico = {
        nombre: datos.nombre,
        email: datos.email,
        fechaNacimiento: datos.fechaNacimiento,
      };
      sesion = usuario;
      return usuario;
    },
    // Iniciar sesión devuelve un usuario de prueba con el correo indicado.
    iniciarSesion: async (email: string) => {
      const usuario: UsuarioPublico = {
        nombre: 'Ana Pérez',
        email,
        fechaNacimiento: '1990-05-04',
      };
      sesion = usuario;
      return usuario;
    },
    // Cerrar sesión olvida al usuario activo.
    cerrarSesion: () => {
      sesion = null;
    },
    // Devuelve la sesión actual.
    usuarioActual: () => sesion,
  };
}

/** Pruebas de la vista de sesión: usuario autenticado, registro y cierre de sesión. */
describe('Login Component (sesión)', () => {
  // Monta el componente con el servicio de autenticación indicado.
  async function montar(auth: ServicioAutenticacion): Promise<ComponentFixture<Login>> {
    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [
        { provide: AUTENTICACION, useValue: auth },
        // Ruta de destino tras autenticarse.
        provideRouter([{ path: 'perfil', children: [] }]),
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(Login);
    fixture.detectChanges();
    return fixture;
  }

  it('debe mostrar los datos del usuario que ya tenía la sesión abierta', async () => {
    const fixture = await montar(
      crearAuthFalsa({
        nombre: 'Ana Pérez',
        email: 'ana@ejemplo.com',
        fechaNacimiento: '1990-05-04',
      }),
    );
    const compiled = fixture.nativeElement as HTMLElement;

    // El saludo debe incluir el nombre del usuario.
    expect(compiled.querySelector('.acceso__titulo')?.textContent).toContain('Ana Pérez');
    // El correo debe aparecer en la descripción de la sesión.
    expect(compiled.querySelector('.acceso__texto')?.textContent).toContain('ana@ejemplo.com');
    // La fecha se muestra en formato DD/MM/AAAA.
    expect(compiled.querySelector('.acceso__sesion')?.textContent).toContain('04/05/1990');
    // Con la sesión abierta no deben verse los formularios.
    expect(compiled.querySelector('#login-email')).toBeFalsy();
  });

  it('debe mostrar el usuario en la pantalla de acceso tras iniciar sesión', async () => {
    const fixture = await montar(crearAuthFalsa());
    const component = fixture.componentInstance;

    // Rellena credenciales válidas y ejecuta el acceso.
    component.loginForm.setValue({ email: 'ana@ejemplo.com', password: 'secreta123' });
    await component.iniciarSesion();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('.acceso__titulo')?.textContent).toContain('Ana Pérez');
    expect(compiled.querySelector('.acceso__texto')?.textContent).toContain('ana@ejemplo.com');
    // Tras autenticarse se entra automáticamente en el perfil del usuario.
    expect(TestBed.inject(Router).url).toBe('/perfil');
  });

  it('debe iniciar sesión automáticamente al registrar una cuenta', async () => {
    const fixture = await montar(crearAuthFalsa());
    const component = fixture.componentInstance;

    // Completa el formulario de registro con datos válidos.
    component.cambiarModo('registro');
    component.registroForm.setValue({
      nombre: 'Luis Gómez',
      email: 'luis@ejemplo.com',
      confirmarEmail: 'luis@ejemplo.com',
      fechaNacimiento: '1995-02-10',
      password: 'contrasena123',
      confirmarPassword: 'contrasena123',
    });
    await component.registrar();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    // La sesión debe quedar abierta con la cuenta recién creada.
    expect(component.usuarioActivo?.nombre).toBe('Luis Gómez');
    expect(compiled.querySelector('.acceso__titulo')?.textContent).toContain('Luis Gómez');
    expect(compiled.querySelector('.acceso__sesion')?.textContent).toContain('luis@ejemplo.com');
    // Con la cuenta recién creada se entra automáticamente en el perfil.
    expect(TestBed.inject(Router).url).toBe('/perfil');
  });

  it('debe volver a los formularios al cerrar sesión', async () => {
    const fixture = await montar(
      crearAuthFalsa({
        nombre: 'Ana Pérez',
        email: 'ana@ejemplo.com',
        fechaNacimiento: '1990-05-04',
      }),
    );
    const component = fixture.componentInstance;

    component.cerrarSesion();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    // Ya no debe haber usuario activo y debe reaparecer el formulario.
    expect(component.usuarioActivo).toBeNull();
    expect(compiled.querySelector('#login-email')).toBeTruthy();
  });
});
