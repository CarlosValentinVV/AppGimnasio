import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';

/**
 * Configuración global de la aplicación Angular.
 *
 * Registra el router, la restauración de la posición de scroll y los
 * escuchadores globales de errores del navegador.
 *
 * @author raulmoron
 * @version 1.0
 */
export const appConfig: ApplicationConfig = {
  // Servicios y utilidades disponibles en toda la aplicación.
  providers: [
    /** Captura y notifica los errores globales no controlados del navegador. */
    provideBrowserGlobalErrorListeners(),

    /** Habilita la navegación por rutas con scroll a anclas y restauración de posición. */
    provideRouter(
      // Rutas que puede resolver el router.
      routes,
      // Comportamiento del scroll durante la navegación.
      withInMemoryScrolling({
        // Permite desplazarse a los fragmentos (`#seccion`) de la URL.
        anchorScrolling: 'enabled',
        // Restaura la posición de scroll al volver a una ruta.
        scrollPositionRestoration: 'enabled',
      }),
    ),
  ],
};
