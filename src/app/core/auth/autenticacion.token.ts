import { InjectionToken } from '@angular/core';

import { AutenticacionLocal } from './autenticacion-local';
import type { ServicioAutenticacion } from './autenticacion.model';

/**
 * Punto de enlace de la autenticación.
 *
 * Decide qué implementación de {@link ServicioAutenticacion} recibe la
 * aplicación cuando un componente inyecta `AUTENTICACION`. Para cambiar el
 * sistema de almacenamiento basta con modificar la `factory` de este token,
 * sin tocar los componentes que lo consumen.
 *
 * @author raulmoron
 * @version 1.0
 */
export const AUTENTICACION = new InjectionToken<ServicioAutenticacion>('AUTENTICACION', {
  // El servicio se crea una sola vez y se comparte en toda la aplicación.
  providedIn: 'root',
  // La fábrica devuelve la implementación local basada en el navegador.
  factory: () => new AutenticacionLocal(),
});
