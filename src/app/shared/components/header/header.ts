import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ThemeService } from '../../services/theme.service';

interface EnlaceNavegacion {
  etiqueta: string;
  fragmento: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  private readonly themeService = inject(ThemeService);

  readonly isDarkMode = this.themeService.isDarkMode;
  readonly mobileMenuOpen = signal(false);

  readonly enlacesNavegacion: readonly EnlaceNavegacion[] = [
    { etiqueta: 'Por qué elegirnos', fragmento: 'caracteristicas' },
    { etiqueta: 'Clases', fragmento: 'clases' },
    { etiqueta: 'Planes', fragmento: 'planes' },
    { etiqueta: 'Opiniones', fragmento: 'testimonios' },
    { etiqueta: 'Preguntas', fragmento: 'faq' },
  ];

  toggleTheme(): void {
    this.themeService.toggle();
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update((open) => !open);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }
}
