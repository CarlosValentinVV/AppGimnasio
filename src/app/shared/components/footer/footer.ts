import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface EnlaceFooter {
  etiqueta: string;
  fragmento: string;
}

@Component({
  selector: 'app-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  readonly anioActual = new Date().getFullYear();

  readonly enlacesGimnasio: readonly EnlaceFooter[] = [
    { etiqueta: 'Por qué elegirnos', fragmento: 'caracteristicas' },
    { etiqueta: 'Clases dirigidas', fragmento: 'clases' },
    { etiqueta: 'Planes y precios', fragmento: 'planes' },
    { etiqueta: 'Opiniones', fragmento: 'testimonios' },
    { etiqueta: 'Preguntas frecuentes', fragmento: 'faq' },
  ];

  readonly enlacesMembresias: readonly EnlaceFooter[] = [
    { etiqueta: 'Pase Básico', fragmento: 'planes' },
    { etiqueta: 'Pase PRO Total', fragmento: 'planes' },
    { etiqueta: 'Plan Elite 1 a 1', fragmento: 'planes' },
    { etiqueta: 'Comparar planes', fragmento: 'planes' },
  ];

  volverArriba(): void {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
