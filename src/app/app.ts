import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Footer } from './shared/components/footer/footer';
import { Header } from './shared/components/header/header';
import { ThemeService } from './shared/services/theme.service';

@Component({
  imports: [RouterOutlet, Header, Footer],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
  host: {
    '[class.modo-oscuro]': 'isDarkMode()',
    '[class.modo-claro]': '!isDarkMode()',
  },
})
export class App {
  protected readonly title = signal('AppGimnasio');

  private readonly themeService = inject(ThemeService);
  readonly isDarkMode = this.themeService.isDarkMode;
}
