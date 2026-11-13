import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
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
