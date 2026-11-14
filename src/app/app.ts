import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Footer } from './shared/components/footer/footer';
import { Header } from './shared/components/header/header';
import { ThemeService } from './shared/services/theme.service';

/**
 * Componente raíz de la aplicación.
 *
 * Compone el header, el contenido enrutado y el footer, y aplica al elemento
 * anfitrión la clase del tema activo para que toda la interfaz cambie de
 * aspecto de forma global.
 *
 * @author raulmoron
 * @version 1.0
 */
@Component({
  // Componentes y directivas que usa la plantilla raíz.
  imports: [RouterOutlet, Header, Footer],
  // Selector con el que se monta la aplicación en `index.html`.
  selector: 'app-root',
  // Hoja de estilos propia del componente raíz.
  styleUrl: './app.css',
  // Plantilla HTML del componente raíz.
  templateUrl: './app.html',
  // Clases que se aplican dinámicamente al elemento anfitrión.
  host: {
    // Activa los estilos oscuros cuando el tema lo indica.
    '[class.modo-oscuro]': 'isDarkMode()',
    // Activa los estilos claros en caso contrario.
    '[class.modo-claro]': '!isDarkMode()',
  },
})
export class App {
  /** Título interno de la aplicación. */
  protected readonly title = signal('AppGimnasio');

  /** Servicio compartido que controla el tema claro/oscuro. */
  private readonly themeService = inject(ThemeService);

  /** Indica si el modo oscuro está activo. */
  readonly isDarkMode = this.themeService.isDarkMode;
}
