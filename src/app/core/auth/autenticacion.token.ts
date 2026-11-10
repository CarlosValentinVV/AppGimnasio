import { InjectionToken } from '@angular/core';

import { AutenticacionLocal } from './autenticacion-local';
import type { ServicioAutenticacion } from './autenticacion.model';

/**
 * Punto de enlace: decide qué implementación recibe la aplicación cuando un
 * componente pide AUTENTICACION. Para cambiar de almacenamiento solo hay que
 * modificar la línea de factory, sin tocar el componente.
 */
export const AUTENTICACION = new InjectionToken<ServicioAutenticacion>('AUTENTICACION', {
  providedIn: 'root',
  factory: () => new AutenticacionLocal(),
});
