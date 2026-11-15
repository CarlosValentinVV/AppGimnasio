import { signal, WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { AUTENTICACION } from '../../../core/auth/autenticacion.token';
import type { ServicioAutenticacion, UsuarioPublico } from '../../../core/auth/autenticacion.model';
import { ThemeService } from '../../services/theme.service';
import { Header } from './header';

/** Usuario de prueba con la sesión abierta. */
const USUARIO: UsuarioPublico = {
  nombre: 'Ana Pérez',
  email: 'ana@ejemplo.com',
  fechaNacimiento: '1990-05-04'
};

/** Servicio de autenticación falso cuya sesión se puede modificar desde las pruebas. */
interface AuthFalsa extends ServicioAutenticacion {
  /** Señal de sesión que lee la cabecera. */
  sesion: WritableSignal<UsuarioPublico | null>;
}

/** Crea el servicio falso con la sesión indicada. */
function crearAuthFalsa(usuario: UsuarioPublico | null = null): AuthFalsa {
  // Sesión reactiva compartida con el componente.
  const sesion = signal<UsuarioPublico | null>(usuario);

  return {
    // La cabecera no registra usuarios.
    registrar: () => Promise.reject(new Error('No usado en estas pruebas')),
    // La cabecera no inicia sesión.
    iniciarSesion: () => Promise.reject(new Error('No usado en estas pruebas')),
    // Cerrar la sesión actualiza la señal.
    cerrarSesion: () => sesion.set(null),
    // Devuelve el valor actual de la sesión.
    usuarioActual: () => sesion(),
    sesion
  };
}

/** Pruebas de la cabecera: marca, navegación, menú móvil, sesión y tema compartido. */
describe('Header', () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;
  let auth: AuthFalsa;

  beforeEach(async () => {
    // Servicio falso sin sesión por defecto.
    auth = crearAuthFalsa();

    // Configura el entorno de pruebas con el componente, el router y la autenticación.
    await TestBed.configureTestingModule({
      imports: [Header],
      providers: [
        provideRouter([
          { path: 'home', children: [] },
          { path: 'login', children: [] },
          { path: 'perfil', children: [] }
        ]),
        { provide: AUTENTICACION, useValue: auth }
      ]
    }).compileComponents();

    // Crea la instancia del componente bajo prueba.
    fixture = TestBed.createComponent(Header);
    // Expone la clase TypeScript del componente.
    component = fixture.componentInstance;
    // Espera a que la vista termine de estabilizarse.
    await fixture.whenStable();
  });

  it('should create', () => {
    // Comprueba que el componente se ha creado correctamente.
    expect(component).toBeTruthy();
  });

  it('debe mostrar la marca y los enlaces principales', () => {
    // Recupera el elemento HTML renderizado.
    const compiled = fixture.nativeElement as HTMLElement;

    // Verifica el nombre de la marca.
    expect(compiled.querySelector('.marca-texto')?.textContent).toContain('JIMNASIO');
    // Verifica que se muestran los cinco enlaces principales.
    expect(compiled.querySelectorAll('.navegacion-desktop .nav-enlace').length).toBe(5);
  });

  it('debe mostrar el botón de acceso y ocultar el de perfil cuando no hay sesión', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const acceso = compiled.querySelector('.enlace-acceso') as HTMLAnchorElement;

    // Sin sesión solo aparece el enlace de acceso.
    expect(acceso).toBeTruthy();
    expect(acceso.textContent).toContain('Acceso');
    expect(acceso.getAttribute('href')).toBe('/login');
    expect(compiled.querySelector('.enlace-perfil')).toBeFalsy();
    expect(compiled.querySelector('.enlace-salir')).toBeFalsy();
    expect(component.haySesion()).toBe(false);
  });

  it('debe mostrar el botón de perfil y ocultar el de acceso cuando hay sesión', async () => {
    // Abre una sesión antes de renderizar de nuevo.
    auth.sesion.set(USUARIO);
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    const perfil = compiled.querySelector('.enlace-perfil') as HTMLAnchorElement;

    // Con sesión solo aparece el enlace al perfil.
    expect(perfil).toBeTruthy();
    expect(perfil.textContent).toContain('Mi perfil');
    expect(perfil.getAttribute('href')).toBe('/perfil');
    expect(compiled.querySelector('.enlace-acceso')).toBeFalsy();
    expect(compiled.querySelector('.enlace-salir')).toBeTruthy();
    expect(component.haySesion()).toBe(true);
  });

  it('debe cerrar la sesión y volver al inicio al pulsar "Salir"', async () => {
    auth.sesion.set(USUARIO);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const boton = compiled.querySelector('.enlace-salir') as HTMLButtonElement;

    // El botón muestra el texto y el título esperados.
    expect(boton).toBeTruthy();
    expect(boton.textContent).toContain('Salir');
    expect(boton.getAttribute('title')).toBe('Cerrar sesión');

    // Al pulsarlo se cierra la sesión y se abandona la zona privada.
    boton.click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(component.haySesion()).toBe(false);
    expect(compiled.querySelector('.enlace-acceso')).toBeTruthy();
    expect(compiled.querySelector('.enlace-perfil')).toBeFalsy();
    expect(TestBed.inject(Router).url).toBe('/home');
  });

  it('debe cerrar la sesión también desde el menú móvil', async () => {
    auth.sesion.set(USUARIO);
    component.toggleMobileMenu();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const boton = compiled.querySelector('.menu-movil-salir') as HTMLButtonElement;

    expect(boton).toBeTruthy();
    expect(boton.textContent).toContain('Cerrar sesión');

    // El clic cierra la sesión, pliega el menú y navega al inicio.
    boton.click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(component.mobileMenuOpen()).toBe(false);
    expect(component.haySesion()).toBe(false);
    expect(compiled.querySelector('.menu-movil')).toBeFalsy();
    expect(TestBed.inject(Router).url).toBe('/home');
  });

  it('debe cambiar el botón al iniciar y cerrar sesión sin recargar la página', async () => {
    const compiled = fixture.nativeElement as HTMLElement;

    // Inicio de sesión: el acceso se sustituye por el perfil.
    auth.sesion.set(USUARIO);
    fixture.detectChanges();
    expect(compiled.querySelector('.enlace-perfil')).toBeTruthy();
    expect(compiled.querySelector('.enlace-acceso')).toBeFalsy();

    // Cierre de sesión: vuelve a mostrarse el acceso.
    auth.sesion.set(null);
    fixture.detectChanges();
    expect(compiled.querySelector('.enlace-acceso')).toBeTruthy();
    expect(compiled.querySelector('.enlace-perfil')).toBeFalsy();
  });

  it('debe mostrar el botón correcto también en el menú móvil', async () => {
    const compiled = fixture.nativeElement as HTMLElement;
    component.toggleMobileMenu();
    fixture.detectChanges();

    // Sin sesión el menú móvil ofrece "Acceso".
    expect(compiled.querySelector('.menu-movil-perfil')?.textContent).toContain('Acceso');

    // Con sesión el menú móvil ofrece "Mi perfil".
    auth.sesion.set(USUARIO);
    fixture.detectChanges();
    const enlacePerfil = compiled.querySelector('.menu-movil-perfil') as HTMLAnchorElement;

    expect(enlacePerfil.textContent).toContain('Mi perfil');
    expect(enlacePerfil.getAttribute('href')).toBe('/perfil');
  });

  it('debe alternar el menú móvil', () => {
    // El menú debe empezar cerrado.
    expect(component.mobileMenuOpen()).toBeFalsy();
    // Al alternar, debe abrirse.
    component.toggleMobileMenu();
    expect(component.mobileMenuOpen()).toBeTruthy();
    // Al cerrar, debe volver a ocultarse.
    component.closeMobileMenu();
    expect(component.mobileMenuOpen()).toBeFalsy();
  });

  it('debe alternar el tema compartido', () => {
    // Obtiene el servicio de tema compartido.
    const themeService = TestBed.inject(ThemeService);
    // Fuerza el modo claro antes de la prueba.
    themeService.setDarkMode(false);

    // El modo oscuro debe estar desactivado inicialmente.
    expect(component.isDarkMode()).toBeFalsy();
    // Al alternar, debe activarse.
    component.toggleTheme();
    expect(component.isDarkMode()).toBeTruthy();
    // Al alternar de nuevo, debe desactivarse.
    component.toggleTheme();
    expect(component.isDarkMode()).toBeFalsy();
  });
});
