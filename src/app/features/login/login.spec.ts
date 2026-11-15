import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter, Router } from '@angular/router';

import { AutenticacionLocal } from '../../core/auth/autenticacion-local';
import { AUTENTICACION } from '../../core/auth/autenticacion.token';
import {
  DatosRegistro,
  ErrorAutenticacion,
  ServicioAutenticacion,
  UsuarioPublico
} from '../../core/auth/autenticacion.model';
import { Login } from './login';

/** Usuario de prueba que devuelve el servicio falso tras un acceso correcto. */
const USUARIO_ANA: UsuarioPublico = {
  nombre: 'Ana Pérez',
  email: 'ana@ejemplo.com',
  fechaNacimiento: '1990-05-04'
};

/** Credenciales válidas usadas en las pruebas de inicio de sesión. */
const CREDENCIALES = {
  email: 'ana@ejemplo.com',
  password: 'secreta123'
};

/** Datos válidos para completar el formulario de registro. */
const DATOS_REGISTRO: DatosRegistro = {
  nombre: 'Luis Gómez',
  email: 'luis@ejemplo.com',
  fechaNacimiento: '1995-02-10',
  password: 'contrasena123'
};

/** Opciones que permiten configurar el comportamiento del servicio falso. */
interface OpcionesAuthFalsa {
  /** Sesión que ya existe al montar el componente. */
  usuario?: UsuarioPublico | null;
  /** Error que debe lanzar `iniciarSesion`; si no se indica, el acceso es correcto. */
  errorLogin?: unknown;
  /** Error que debe lanzar `registrar`; si no se indica, el registro es correcto. */
  errorRegistro?: unknown;
}

/** Servicio falso con espías para comprobar las llamadas que hace el componente. */
interface AuthEspia {
  /** Implementación del contrato que recibe el componente. */
  servicio: ServicioAutenticacion;
  /** Espía del método de inicio de sesión. */
  iniciarSesion: ReturnType<typeof vi.fn>;
  /** Espía del método de registro. */
  registrar: ReturnType<typeof vi.fn>;
  /** Espía del cierre de sesión. */
  cerrarSesion: ReturnType<typeof vi.fn>;
}

/**
 * Crea una implementación falsa del servicio de autenticación.
 *
 * Permite comprobar el flujo completo del componente sin depender de
 * `localStorage`, `sessionStorage` ni de la criptografía del navegador.
 */
function crearAuthFalsa(opciones: OpcionesAuthFalsa = {}): AuthEspia {
  // Sesión que mantiene la implementación falsa entre llamadas.
  let sesion: UsuarioPublico | null = opciones.usuario ?? null;

  const iniciarSesion = vi.fn(async (email: string, password: string) => {
    // Reproduce el fallo configurado, si lo hay.
    if (opciones.errorLogin !== undefined) {
      throw opciones.errorLogin;
    }
    // Devuelve el usuario de prueba con el correo introducido.
    sesion = { ...USUARIO_ANA, email };
    return sesion;
  });

  const registrar = vi.fn(async (datos: DatosRegistro) => {
    // Reproduce el fallo configurado, si lo hay.
    if (opciones.errorRegistro !== undefined) {
      throw opciones.errorRegistro;
    }
    // La cuenta creada queda autenticada con los datos introducidos.
    sesion = {
      nombre: datos.nombre,
      email: datos.email,
      fechaNacimiento: datos.fechaNacimiento
    };
    return sesion;
  });

  const cerrarSesion = vi.fn(() => {
    // Cerrar sesión olvida al usuario activo.
    sesion = null;
  });

  return {
    servicio: {
      iniciarSesion,
      registrar,
      cerrarSesion,
      usuarioActual: () => sesion
    },
    iniciarSesion,
    registrar,
    cerrarSesion
  };
}

/** Configura el entorno de pruebas y monta el componente de acceso. */
async function montar(auth: ServicioAutenticacion): Promise<ComponentFixture<Login>> {
  // Permite volver a montar el componente dentro de una misma prueba.
  TestBed.resetTestingModule();

  await TestBed.configureTestingModule({
    // Al ser un componente independiente se añade en `imports`.
    imports: [Login],
    providers: [
      { provide: AUTENTICACION, useValue: auth },
      // Ruta de destino tras autenticarse.
      provideRouter([{ path: 'perfil', children: [] }])
    ]
  }).compileComponents();

  const fixture = TestBed.createComponent(Login);
  fixture.detectChanges();
  return fixture;
}

/** Pruebas de estructura y pestañas del componente de acceso. */
describe('Login Component (estructura y pestañas)', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;

  beforeEach(async () => {
    fixture = await montar(crearAuthFalsa().servicio);
    component = fixture.componentInstance;
  });

  it('debe crearse correctamente la instancia del componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializarse con el modo de acceso en "login" por defecto', () => {
    expect(component.modo).toBe('login');
  });

  it('debe cambiar el estado de la propiedad "modo" al invocar cambiarModo()', () => {
    component.cambiarModo('registro');
    expect(component.modo).toBe('registro');
  });

  it('debe mostrar el formulario de Login y ocultar el de Registro al iniciar', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    // El formulario de acceso existe y el de registro no está en el DOM.
    expect(compiled.querySelector('#login-email')).toBeTruthy();
    expect(compiled.querySelector('#registro-nombre')).toBeFalsy();
  });

  it('debe alternar la visibilidad de los formularios en el DOM al cambiar el modo a "registro"', () => {
    component.cambiarModo('registro');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    // Ahora se muestra el registro y se oculta el acceso.
    expect(compiled.querySelector('#login-email')).toBeFalsy();
    expect(compiled.querySelector('#registro-nombre')).toBeTruthy();
  });

  it('debe aplicar la clase CSS de pestaña activa al botón correspondiente', () => {
    const botones = fixture.debugElement.queryAll(By.css('.acceso__pestaña'));

    const botonLogin = botones[0].nativeElement as HTMLButtonElement;
    const botonRegistro = botones[1].nativeElement as HTMLButtonElement;

    expect(botonLogin.classList.contains('acceso__pestaña--activa')).toBe(true);
    expect(botonRegistro.classList.contains('acceso__pestaña--activa')).toBe(false);
  });

  it('debe cambiar de modo automáticamente cuando el usuario hace clic en la pestaña "Registrarse"', () => {
    const botonRegistroDebug = fixture.debugElement.queryAll(By.css('.acceso__pestaña'))[1];

    // Simula el clic real del usuario en la interfaz.
    botonRegistroDebug.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(component.modo).toBe('registro');
  });

  it('debe limpiar el mensaje de error al cambiar de pestaña', async () => {
    // Provoca un error de credenciales.
    const auth = crearAuthFalsa({ errorLogin: new ErrorAutenticacion('CREDENCIALES_INVALIDAS', 'Correo o contraseña incorrectos.') });
    fixture = await montar(auth.servicio);
    component = fixture.componentInstance;

    component.loginForm.setValue(CREDENCIALES);
    await component.iniciarSesion();
    expect(component.error).not.toBeNull();

    // Cambiar de pestaña descarta el error anterior.
    component.cambiarModo('registro');
    expect(component.error).toBeNull();
  });
});

/** Pruebas de validación del formulario de inicio de sesión. */
describe('Login (validación del formulario)', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let auth: AuthEspia;

  beforeEach(async () => {
    auth = crearAuthFalsa();
    fixture = await montar(auth.servicio);
    component = fixture.componentInstance;
  });

  it('debe exigir correo y contraseña antes de enviar el formulario', () => {
    // Con el formulario vacío ambos campos incumplen `required`.
    expect(component.loginForm.invalid).toBe(true);
    expect(component.loginForm.get('email')?.hasError('required')).toBe(true);
    expect(component.loginForm.get('password')?.hasError('required')).toBe(true);
  });

  it('no debe mostrar errores antes de que el usuario toque los campos', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('#login-email-error')).toBeFalsy();
    expect(compiled.querySelector('#login-password-error')).toBeFalsy();
    expect(component.loginInvalido('email')).toBe(false);
    expect(component.loginInvalido('password')).toBe(false);
  });

  it('debe mostrar el error del correo cuando el campo ya se ha tocado', () => {
    const email = component.loginForm.get('email');
    email?.setValue('correo-sin-arroba');
    email?.markAsTouched();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const input = compiled.querySelector('#login-email') as HTMLInputElement;

    expect(component.loginInvalido('email')).toBe(true);
    expect(input.classList.contains('acceso__campo--error')).toBe(true);
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(compiled.querySelector('#login-email-error')?.textContent).toContain('correo válido');
  });

  it.each([
    'ana',
    'ana@',
    'ana@ejemplo',
    '@ejemplo.com',
    'ana ejemplo@correo.com',
    'ana@ejemplo .com'
  ])('debe rechazar el correo inválido "%s"', (email) => {
    const control = component.loginForm.get('email');
    control?.setValue(email);

    expect(control?.hasError('pattern')).toBe(true);
    expect(component.loginForm.invalid).toBe(true);
  });

  it.each(['ana@ejemplo.com', 'ana.perez+test@sub.ejemplo.com'])(
    'debe aceptar el correo válido "%s"',
    (email) => {
      const control = component.loginForm.get('email');
      control?.setValue(email);

      expect(control?.valid).toBe(true);
    },
  );

  it('debe mostrar el error de contraseña cuando el campo está vacío y se ha tocado', () => {
    const password = component.loginForm.get('password');
    password?.markAsTouched();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const input = compiled.querySelector('#login-password') as HTMLInputElement;

    expect(component.loginInvalido('password')).toBe(true);
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(compiled.querySelector('#login-password-error')?.textContent).toContain('contraseña');
  });

  it('debe marcar los campos y no llamar al servicio si se envía un formulario inválido', async () => {
    await component.iniciarSesion();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    // El servicio no se invoca y el usuario sigue sin sesión.
    expect(auth.iniciarSesion).not.toHaveBeenCalled();
    expect(component.usuarioActivo).toBeNull();
    expect(component.enviando).toBe(false);
    // Los errores quedan visibles y no se navega a ninguna ruta.
    expect(compiled.querySelector('#login-email-error')).toBeTruthy();
    expect(compiled.querySelector('#login-password-error')).toBeTruthy();
    expect(TestBed.inject(Router).url).toBe('/');
  });

  it('debe activar el formulario con credenciales con formato correcto', () => {
    component.loginForm.setValue(CREDENCIALES);

    expect(component.loginForm.valid).toBe(true);
  });
});

/** Pruebas del flujo de inicio de sesión. */
describe('Login (inicio de sesión)', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let auth: AuthEspia;

  beforeEach(async () => {
    auth = crearAuthFalsa();
    fixture = await montar(auth.servicio);
    component = fixture.componentInstance;
  });

  it('debe iniciar sesión con las credenciales introducidas y navegar al perfil', async () => {
    component.loginForm.setValue(CREDENCIALES);

    await component.iniciarSesion();
    fixture.detectChanges();

    // El servicio recibe exactamente el correo y la contraseña del formulario.
    expect(auth.iniciarSesion).toHaveBeenCalledTimes(1);
    expect(auth.iniciarSesion).toHaveBeenCalledWith(CREDENCIALES.email, CREDENCIALES.password);
    // La sesión queda abierta con el usuario devuelto.
    expect(component.usuarioActivo).toEqual({ ...USUARIO_ANA, email: CREDENCIALES.email });
    // El formulario se vacía tras un acceso correcto.
    expect(component.loginForm.getRawValue()).toEqual({ email: '', password: '' });
    expect(component.error).toBeNull();
    expect(component.enviando).toBe(false);
    // Se entra automáticamente en el perfil.
    expect(TestBed.inject(Router).url).toBe('/perfil');
  });

  it('debe mostrar el usuario en la pantalla de acceso tras iniciar sesión', async () => {
    component.loginForm.setValue(CREDENCIALES);

    await component.iniciarSesion();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('.acceso__titulo')?.textContent).toContain('Ana Pérez');
    expect(compiled.querySelector('.acceso__texto')?.textContent).toContain(CREDENCIALES.email);
    // Con la sesión abierta los formularios desaparecen.
    expect(compiled.querySelector('#login-email')).toBeFalsy();
  });

  it('debe indicar el estado de carga mientras el servicio responde', async () => {
    // Retiene la promesa para observar el estado intermedio.
    let resolver!: (usuario: UsuarioPublico) => void;
    auth.iniciarSesion.mockImplementation(
      () => new Promise<UsuarioPublico>((resolve) => (resolver = resolve))
    );
    component.loginForm.setValue(CREDENCIALES);

    const acceso = component.iniciarSesion();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const boton = compiled.querySelector('#panel-login button[type="submit"]') as HTMLButtonElement;
    const formulario = compiled.querySelector('#panel-login') as HTMLFormElement;

    // Mientras se espera: el botón queda deshabilitado y muestra "Entrando…".
    expect(component.enviando).toBe(true);
    expect(boton.disabled).toBe(true);
    expect(boton.textContent).toContain('Entrando');
    expect(formulario.getAttribute('aria-busy')).toBe('true');

    // Se resuelve la autenticación y el estado vuelve a la normalidad.
    resolver(USUARIO_ANA);
    await acceso;
    fixture.detectChanges();

    expect(component.enviando).toBe(false);
    expect(component.usuarioActivo).toEqual(USUARIO_ANA);
  });

  it('debe mostrar el mensaje del error de credenciales y no navegar', async () => {
    auth = crearAuthFalsa({
      errorLogin: new ErrorAutenticacion(
        'CREDENCIALES_INVALIDAS',
        'Correo o contraseña incorrectos.'
      )
    });
    fixture = await montar(auth.servicio);
    component = fixture.componentInstance;
    component.loginForm.setValue({ email: 'ana@ejemplo.com', password: 'incorrecta' });

    await component.iniciarSesion();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(component.usuarioActivo).toBeNull();
    expect(component.enviando).toBe(false);
    expect(component.error).toBe('Correo o contraseña incorrectos.');
    expect(compiled.querySelector('.acceso__error--general')?.textContent).toContain(
      'Correo o contraseña incorrectos.'
    );
    // Sigue en el formulario de acceso.
    expect(compiled.querySelector('#login-email')).toBeTruthy();
    expect(TestBed.inject(Router).url).toBe('/');
  });

  it('debe conservar las credenciales escritas cuando el acceso falla', async () => {
    auth = crearAuthFalsa({
      errorLogin: new ErrorAutenticacion('CREDENCIALES_INVALIDAS', 'Correo o contraseña incorrectos.')
    });
    fixture = await montar(auth.servicio);
    component = fixture.componentInstance;
    component.loginForm.setValue({ email: 'ana@ejemplo.com', password: 'incorrecta' });

    await component.iniciarSesion();

    expect(component.loginForm.getRawValue()).toEqual({
      email: 'ana@ejemplo.com',
      password: 'incorrecta'
    });
  });

  it('debe mostrar un mensaje genérico cuando el error no es de autenticación', async () => {
    auth = crearAuthFalsa({ errorLogin: new Error('Fallo inesperado') });
    fixture = await montar(auth.servicio);
    component = fixture.componentInstance;
    component.loginForm.setValue(CREDENCIALES);

    await component.iniciarSesion();
    fixture.detectChanges();

    expect(component.error).toBe(
      'No se ha podido completar la operación. Inténtalo de nuevo.'
    );
    expect(TestBed.inject(Router).url).toBe('/');
  });

  it('debe descartar el error anterior al reintentar un acceso correcto', async () => {
    auth = crearAuthFalsa({
      errorLogin: new ErrorAutenticacion('CREDENCIALES_INVALIDAS', 'Correo o contraseña incorrectos.')
    });
    fixture = await montar(auth.servicio);
    component = fixture.componentInstance;
    component.loginForm.setValue({ email: 'ana@ejemplo.com', password: 'incorrecta' });

    await component.iniciarSesion();
    expect(component.error).not.toBeNull();

    // El segundo intento ya es correcto.
    auth.iniciarSesion.mockImplementation(async () => USUARIO_ANA);
    component.loginForm.setValue(CREDENCIALES);
    await component.iniciarSesion();

    expect(component.error).toBeNull();
    expect(component.usuarioActivo).toEqual(USUARIO_ANA);
  });
});

/** Pruebas de la vista de sesión y del cierre de sesión. */
describe('Login (sesión activa)', () => {
  it('debe mostrar los datos del usuario que ya tenía la sesión abierta', async () => {
    const fixture = await montar(crearAuthFalsa({ usuario: USUARIO_ANA }).servicio);
    const compiled = fixture.nativeElement as HTMLElement;

    // El saludo incluye el nombre y la descripción el correo.
    expect(compiled.querySelector('.acceso__titulo')?.textContent).toContain('Ana Pérez');
    expect(compiled.querySelector('.acceso__texto')?.textContent).toContain('ana@ejemplo.com');
    // La fecha se muestra en formato DD/MM/AAAA.
    expect(compiled.querySelector('.acceso__sesion')?.textContent).toContain('04/05/1990');
    // Con la sesión abierta no se ven ni las pestañas ni los formularios.
    expect(compiled.querySelector('#login-email')).toBeFalsy();
    expect(compiled.querySelector('.acceso__pestañas')).toBeFalsy();
  });

  it('debe ocultar la fecha de nacimiento cuando el usuario no la tiene', async () => {
    const fixture = await montar(
      crearAuthFalsa({ usuario: { ...USUARIO_ANA, fechaNacimiento: '' } }).servicio
    );
    const component = fixture.componentInstance;
    const compiled = fixture.nativeElement as HTMLElement;

    expect(component.fechaNacimientoLegible).toBe('');
    expect(compiled.querySelector('.acceso__sesion')?.textContent).not.toContain(
      'Fecha de nacimiento'
    );
  });

  it('debe formatear la fecha de nacimiento como DD/MM/AAAA', async () => {
    const fixture = await montar(crearAuthFalsa({ usuario: USUARIO_ANA }).servicio);

    expect(fixture.componentInstance.fechaNacimientoLegible).toBe('04/05/1990');
  });

  it('debe volver a los formularios al cerrar sesión', async () => {
    const auth = crearAuthFalsa({ usuario: USUARIO_ANA });
    const fixture = await montar(auth.servicio);
    const component = fixture.componentInstance;

    component.cerrarSesion();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    // Se delega el cierre en el servicio y se limpia el estado del componente.
    expect(auth.cerrarSesion).toHaveBeenCalledTimes(1);
    expect(component.usuarioActivo).toBeNull();
    expect(component.modo).toBe('login');
    expect(component.error).toBeNull();
    // Reaparece el formulario de acceso.
    expect(compiled.querySelector('#login-email')).toBeTruthy();
    expect(compiled.querySelector('.acceso__titulo')).toBeFalsy();
  });
});

/** Pruebas de validación y envío del formulario de registro. */
describe('Login (registro)', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let auth: AuthEspia;

  beforeEach(async () => {
    auth = crearAuthFalsa();
    fixture = await montar(auth.servicio);
    component = fixture.componentInstance;
    component.cambiarModo('registro');
    fixture.detectChanges();
  });

  /** Rellena el formulario de registro con los datos indicados. */
  function rellenar(parcial: Partial<DatosRegistro & {
    confirmarEmail: string;
    confirmarPassword: string
  }> = {}): void {
    const datos = {
      ...DATOS_REGISTRO,
      confirmarEmail: DATOS_REGISTRO.email,
      confirmarPassword: DATOS_REGISTRO.password,
      ...parcial
    };
    component.registroForm.setValue({
      nombre: datos.nombre,
      email: datos.email,
      confirmarEmail: datos.confirmarEmail,
      fechaNacimiento: datos.fechaNacimiento,
      password: datos.password,
      confirmarPassword: datos.confirmarPassword
    });
  }

  it('debe exigir un nombre de al menos 3 caracteres', () => {
    rellenar({ nombre: 'Lu' });

    expect(component.registroForm.get('nombre')?.hasError('minlength')).toBe(true);
    expect(component.registroForm.invalid).toBe(true);
  });

  it('debe rechazar una fecha de nacimiento futura', () => {
    // Calcula la fecha de mañana en formato AAAA-MM-DD.
    const manana = new Date();
    manana.setDate(manana.getDate() + 1);
    const fechaFutura = manana.toLocaleDateString('en-CA');

    rellenar({ fechaNacimiento: fechaFutura });

    expect(component.registroForm.get('fechaNacimiento')?.hasError('fechaFutura')).toBe(true);
    expect(component.registroForm.invalid).toBe(true);
  });

  it('debe aceptar la fecha de hoy como fecha de nacimiento', () => {
    rellenar({ fechaNacimiento: new Date().toLocaleDateString('en-CA') });

    expect(component.registroForm.get('fechaNacimiento')?.hasError('fechaFutura')).toBe(false);
    expect(component.registroForm.valid).toBe(true);
  });

  it('debe rechazar una contraseña de menos de 8 caracteres', () => {
    rellenar({ password: 'corta', confirmarPassword: 'corta' });

    expect(component.registroForm.get('password')?.hasError('minlength')).toBe(true);
    expect(component.registroForm.invalid).toBe(true);
  });

  it('debe detectar que los correos no coinciden ignorando mayúsculas y espacios', () => {
    rellenar({ confirmarEmail: ' LUIS@EJEMPLO.COM ' });

    // La normalización hace que ambos correos sean equivalentes.
    expect(component.registroForm.hasError('emailsDistintos')).toBe(false);

    // Con correos realmente distintos el grupo queda inválido.
    component.registroForm.patchValue({ confirmarEmail: 'otro@ejemplo.com' });
    expect(component.registroForm.hasError('emailsDistintos')).toBe(true);
    expect(component.registroForm.invalid).toBe(true);
  });

  it('debe mostrar el aviso de correos distintos solo al tocar la confirmación', () => {
    rellenar({ confirmarEmail: 'otro@ejemplo.com' });
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    // Aún no se ha tocado el campo de confirmación.
    expect(compiled.querySelector('#registro-emails-no-coinciden')).toBeFalsy();

    component.registroForm.get('confirmarEmail')?.markAsTouched();
    fixture.detectChanges();

    expect(compiled.querySelector('#registro-emails-no-coinciden')?.textContent).toContain(
      'no coinciden'
    );
  });

  it('debe detectar que las contraseñas no coinciden', () => {
    rellenar({ confirmarPassword: 'otraContrasena' });

    expect(component.registroForm.hasError('passwordsDistintas')).toBe(true);
    expect(component.registroForm.invalid).toBe(true);
  });

  it('no debe registrar si el formulario es inválido', async () => {
    rellenar({ confirmarPassword: 'otraContrasena' });

    await component.registrar();
    fixture.detectChanges();

    expect(auth.registrar).not.toHaveBeenCalled();
    expect(component.usuarioActivo).toBeNull();
    expect(component.enviando).toBe(false);
    expect(TestBed.inject(Router).url).toBe('/');
  });

  it('debe iniciar sesión automáticamente al registrar una cuenta', async () => {
    rellenar();

    await component.registrar();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    // El servicio recibe los datos normalizados del formulario.
    expect(auth.registrar).toHaveBeenCalledWith(DATOS_REGISTRO);
    // La sesión queda abierta con la cuenta recién creada.
    expect(component.usuarioActivo?.nombre).toBe('Luis Gómez');
    expect(compiled.querySelector('.acceso__titulo')?.textContent).toContain('Luis Gómez');
    expect(compiled.querySelector('.acceso__sesion')?.textContent).toContain('luis@ejemplo.com');
    // Con la cuenta recién creada se entra automáticamente en el perfil.
    expect(TestBed.inject(Router).url).toBe('/perfil');
  });

  it('debe mostrar el error cuando el correo ya está registrado', async () => {
    auth = crearAuthFalsa({
      errorRegistro: new ErrorAutenticacion(
        'EMAIL_YA_REGISTRADO',
        'Ya existe una cuenta con ese correo electrónico.'
      )
    });
    fixture = await montar(auth.servicio);
    component = fixture.componentInstance;
    component.cambiarModo('registro');
    rellenar();

    await component.registrar();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(component.usuarioActivo).toBeNull();
    expect(component.error).toBe('Ya existe una cuenta con ese correo electrónico.');
    expect(compiled.querySelector('.acceso__error--general')?.textContent).toContain(
      'Ya existe una cuenta'
    );
    expect(TestBed.inject(Router).url).toBe('/');
  });
});

/**
 * Pruebas de integración del componente con el servicio real de autenticación.
 *
 * Comprueban el flujo completo registro → cierre → acceso usando
 * `localStorage`/`sessionStorage` y la criptografía del navegador.
 */
describe('Login con AutenticacionLocal (integración)', () => {
  let servicio: AutenticacionLocal;

  beforeEach(() => {
    // Cada prueba parte de un almacenamiento vacío.
    localStorage.clear();
    sessionStorage.clear();
    servicio = new AutenticacionLocal();
  });

  afterEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  /** Registra la cuenta de prueba y cierra su sesión. */
  async function registrarCuenta(): Promise<void> {
    await servicio.registrar(DATOS_REGISTRO);
    servicio.cerrarSesion();
  }

  it('debe permitir acceder después de registrar la cuenta', async () => {
    await registrarCuenta();
    const fixture = await montar(servicio);
    const component = fixture.componentInstance;

    component.loginForm.setValue({
      email: 'LUIS@EJEMPLO.COM',
      password: DATOS_REGISTRO.password
    });
    await component.iniciarSesion();
    fixture.detectChanges();

    // El correo se normaliza y la sesión queda guardada.
    expect(component.error).toBeNull();
    expect(component.usuarioActivo?.email).toBe('luis@ejemplo.com');
    expect(servicio.usuarioActual()?.nombre).toBe('Luis Gómez');
    expect(TestBed.inject(Router).url).toBe('/perfil');
  });

  it('debe rechazar una contraseña incorrecta', async () => {
    await registrarCuenta();
    const fixture = await montar(servicio);
    const component = fixture.componentInstance;

    component.loginForm.setValue({
      email: DATOS_REGISTRO.email,
      password: 'contrasenaEquivocada'
    });
    await component.iniciarSesion();
    fixture.detectChanges();

    expect(component.error).toBe('Correo o contraseña incorrectos.');
    expect(component.usuarioActivo).toBeNull();
    expect(servicio.usuarioActual()).toBeNull();
    expect(TestBed.inject(Router).url).toBe('/');
  });

  it('debe rechazar un correo que no está registrado', async () => {
    const fixture = await montar(servicio);
    const component = fixture.componentInstance;

    component.loginForm.setValue({
      email: 'nadie@ejemplo.com',
      password: DATOS_REGISTRO.password
    });
    await component.iniciarSesion();

    expect(component.error).toBe('Correo o contraseña incorrectos.');
    expect(component.usuarioActivo).toBeNull();
    expect(TestBed.inject(Router).url).toBe('/');
  });

  it('debe mantenerse autenticado al volver a montar el componente', async () => {
    // Registra la cuenta desde el propio componente.
    const primero = await montar(servicio);
    primero.componentInstance.cambiarModo('registro');
    primero.componentInstance.registroForm.setValue({
      nombre: DATOS_REGISTRO.nombre,
      email: DATOS_REGISTRO.email,
      confirmarEmail: DATOS_REGISTRO.email,
      fechaNacimiento: DATOS_REGISTRO.fechaNacimiento,
      password: DATOS_REGISTRO.password,
      confirmarPassword: DATOS_REGISTRO.password
    });
    await primero.componentInstance.registrar();
    primero.detectChanges();

    // Una nueva visita al componente recupera la sesión guardada.
    const segundo = await montar(servicio);
    const compiled = segundo.nativeElement as HTMLElement;

    expect(segundo.componentInstance.usuarioActivo?.email).toBe(DATOS_REGISTRO.email);
    expect(compiled.querySelector('.acceso__titulo')?.textContent).toContain('Luis Gómez');
  });

  it('no debe permitir registrar dos veces el mismo correo', async () => {
    await registrarCuenta();

    await expect(servicio.registrar(DATOS_REGISTRO)).rejects.toBeInstanceOf(ErrorAutenticacion);
    await expect(servicio.registrar(DATOS_REGISTRO)).rejects.toMatchObject({
      codigo: 'EMAIL_YA_REGISTRADO'
    });
  });
});
