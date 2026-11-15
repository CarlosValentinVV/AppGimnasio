import { Injectable, signal } from '@angular/core';

/**
 * Estado compartido del tema de la aplicación.
 *
 * Al vivir en la raíz, el header, el footer y las páginas comparten el mismo
 * modo claro/oscuro sin duplicar señales en cada componente.
 *
 * @author Izan García
 * @version 1.0
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  /** Estado interno del tema. `true` indica modo oscuro. */
  private readonly darkMode = signal(false);

  /** Señal de solo lectura que expone el estado actual del tema. */
  readonly isDarkMode = this.darkMode.asReadonly();

  /**
   * Alterna entre el modo claro y el modo oscuro.
   */
  toggle(): void {
    // Invierte el valor actual del estado del tema.
    this.darkMode.update((dark) => !dark);
  }

  /**
   * Establece explícitamente el modo oscuro.
   *
   * @param dark `true` para activar el modo oscuro, `false` para el claro.
   */
  setDarkMode(dark: boolean): void {
    // Fija el estado del tema al valor indicado.
    this.darkMode.set(dark);
  }
}
