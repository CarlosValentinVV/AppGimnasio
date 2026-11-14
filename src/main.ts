import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

/**
 * Punto de entrada de la aplicación Angular.
 *
 * Arranca el componente raíz `App` con la configuración global definida en
 * `appConfig` y registra en consola cualquier error fatal de arranque.
 *
 * @author raulmoron
 * @version 1.0
 */
// Inicia la aplicación y captura cualquier error de arranque.
bootstrapApplication(App, appConfig).catch((err) => console.error(err));
