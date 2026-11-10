import { Injectable, signal } from '@angular/core';

/**
 * Estado compartido del tema de la aplicación.
 *
 * Al vivir en la raíz, el header, el footer y las páginas comparten el mismo
 * modo claro/oscuro sin duplicar señales en cada componente.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly darkMode = signal(false);

  readonly isDarkMode = this.darkMode.asReadonly();

  toggle(): void {
    this.darkMode.update((dark) => !dark);
  }

  setDarkMode(dark: boolean): void {
    this.darkMode.set(dark);
  }
}
