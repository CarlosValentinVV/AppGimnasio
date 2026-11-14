import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ThemeService } from '../../services/theme.service';

/** Enlace de navegación del menú principal, definido por una etiqueta y un fragmento de la página. */
interface EnlaceNavegacion {
  /** Texto visible del enlace. */
  etiqueta: string;
  /** Identificador del fragmento de la página al que apunta el enlace. */
  fragmento: string;
}

/**
 * Cabecera principal de la aplicación.
 *
 * Muestra la navegación por secciones de la página de inicio, el botón de
 * cambio de tema y el menú móvil desplegable.
 *
 * @author raulmoron
 * @version 1.0
 */
@Component({
  // Selector usado en las plantillas para insertar la cabecera.
  selector: 'app-header',
  // Componente independiente, sin necesidad de declararlo en un módulo.
  standalone: true,
  // Optimiza el renderizado comprobando cambios solo cuando se notifican.
  changeDetection: ChangeDetectionStrategy.OnPush,
  // Directiva necesaria para los enlaces del router.
  imports: [RouterLink],
  // Plantilla HTML de la cabecera.
  templateUrl: './header.html',
  // Hoja de estilos de la cabecera.
  styleUrl: './header.css',
})
export class Header {
  /** Estado de apertura del menú de navegación móvil. */
  readonly mobileMenuOpen = signal(false);
  /** Enlaces de navegación a las secciones de la página de inicio. */
  readonly enlacesNavegacion: readonly EnlaceNavegacion[] = [
    // Sección de ventajas competitivas.
    { etiqueta: 'Por qué elegirnos', fragmento: 'caracteristicas' },
    // Sección del catálogo de clases.
    { etiqueta: 'Clases', fragmento: 'clases' },
    // Sección de planes y precios.
    { etiqueta: 'Planes', fragmento: 'planes' },
    // Sección de opiniones de socios.
    { etiqueta: 'Opiniones', fragmento: 'testimonios' },
    // Sección de preguntas frecuentes.
    { etiqueta: 'Preguntas', fragmento: 'faq' },
  ];
  /** Servicio compartido que controla el tema claro/oscuro. */
  private readonly themeService = inject(ThemeService);
  /** Indica si el tema oscuro está activo (señal de solo lectura). */
  readonly isDarkMode = this.themeService.isDarkMode;

  /** Alterna entre el tema claro y el oscuro. */
  toggleTheme(): void {
    // Delega el cambio en el servicio compartido.
    this.themeService.toggle();
  }

  /** Abre o cierra el menú de navegación móvil. */
  toggleMobileMenu(): void {
    // Invierte el estado actual del menú.
    this.mobileMenuOpen.update((open) => !open);
  }

  /** Cierra el menú de navegación móvil. */
  closeMobileMenu(): void {
    // Fuerza el estado cerrado del menú.
    this.mobileMenuOpen.set(false);
  }
}
