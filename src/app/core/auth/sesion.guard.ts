import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AUTENTICACION } from './autenticacion.token';

/**
 * Guard de las rutas que requieren una sesión iniciada.
 *
 * Si no hay usuario autenticado, cancela la navegación y redirige a la
 * pantalla de acceso para que la persona inicie sesión o se registre.
 *
 * @author Izan García Iglesias
 * @version 1.0
 */
export const sesionGuard: CanActivateFn = () => {
  // Servicio de autenticación del que se consulta la sesión activa.
  const auth = inject(AUTENTICACION);
  // Router usado para redirigir cuando no hay sesión.
  const router = inject(Router);

  // Con sesión abierta se permite el acceso a la ruta.
  if (auth.usuarioActual()) {
    return true;
  }

  // Sin sesión se redirige a la pantalla de acceso.
  return router.createUrlTree(['/login']);
};
