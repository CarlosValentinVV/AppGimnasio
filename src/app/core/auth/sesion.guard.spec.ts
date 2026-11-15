import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, UrlTree } from '@angular/router';

import { AUTENTICACION } from './autenticacion.token';
import type { ServicioAutenticacion, UsuarioPublico } from './autenticacion.model';
import { sesionGuard } from './sesion.guard';

/** Crea un servicio de autenticación falso que devuelve la sesión indicada. */
function crearAuthFalsa(sesion: UsuarioPublico | null): ServicioAutenticacion {
  return {
    // El guard no registra usuarios.
    registrar: () => Promise.reject(new Error('No usado en estas pruebas')),
    // El guard no inicia sesión.
    iniciarSesion: () => Promise.reject(new Error('No usado en estas pruebas')),
    // El guard no cierra sesión.
    cerrarSesion: () => undefined,
    // Devuelve la sesión configurada para la prueba.
    usuarioActual: () => sesion,
  };
}

/** Pruebas del guard de rutas privadas. */
describe('sesionGuard', () => {
  /** Ejecuta el guard dentro del contexto de inyección de Angular. */
  function ejecutarGuard(): boolean | UrlTree {
    // El guard solo usa servicios, así que basta con un contexto de inyección.
    return TestBed.runInInjectionContext(() => sesionGuard({} as never, {} as never)) as
      | boolean
      | UrlTree;
  }

  it('debe permitir el acceso cuando hay una sesión abierta', () => {
    // Entorno con un usuario autenticado.
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        {
          provide: AUTENTICACION,
          useValue: crearAuthFalsa({
            nombre: 'Izan García Iglesias',
            email: 'izan@ejemplo.com',
            fechaNacimiento: '1998-03-15',
          }),
        },
      ],
    });

    // Con sesión el guard deja pasar a la ruta.
    expect(ejecutarGuard()).toBe(true);
  });

  it('debe redirigir al acceso cuando no hay sesión', () => {
    // Entorno sin usuario autenticado.
    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: AUTENTICACION, useValue: crearAuthFalsa(null) }],
    });

    // Sin sesión el guard devuelve una redirección a `/login`.
    const resultado = ejecutarGuard();
    expect(resultado).toBeInstanceOf(UrlTree);
    expect(String(resultado)).toBe('/login');
    // El router se crea correctamente dentro del contexto de inyección.
    expect(TestBed.inject(Router)).toBeTruthy();
  });
});
