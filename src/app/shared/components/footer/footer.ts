import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/** Enlace del pie de página, definido por una etiqueta y un fragmento de la página. */
interface EnlaceFooter {
  /** Texto visible del enlace. */
  etiqueta: string;
  /** Identificador del fragmento de la página al que apunta el enlace. */
  fragmento: string;
}

/**
 * Pie de página principal de la aplicación.
 *
 * Agrupa los enlaces a las secciones del gimnasio y a las membresías, muestra
 * el año actual y permite volver al inicio de la página.
 *
 * @author raulmoron
 * @version 1.0
 */
@Component({
  // Selector usado en las plantillas para insertar el pie de página.
  selector: 'app-footer',
  // Componente independiente, sin necesidad de declararlo en un módulo.
  standalone: true,
  // Optimiza el renderizado comprobando cambios solo cuando se notifican.
  changeDetection: ChangeDetectionStrategy.OnPush,
  // Directiva necesaria para los enlaces del router.
  imports: [RouterLink],
  // Plantilla HTML del pie de página.
  templateUrl: './footer.html',
  // Hoja de estilos del pie de página.
  styleUrl: './footer.css',
})
export class Footer {
  /** Año actual usado en el aviso de derechos de autor. */
  readonly anioActual = new Date().getFullYear();

  /** Enlaces a las secciones informativas del gimnasio. */
  readonly enlacesGimnasio: readonly EnlaceFooter[] = [
    // Sección de ventajas competitivas.
    { etiqueta: 'Por qué elegirnos', fragmento: 'caracteristicas' },
    // Sección del catálogo de clases dirigidas.
    { etiqueta: 'Clases dirigidas', fragmento: 'clases' },
    // Sección de planes y precios.
    { etiqueta: 'Planes y precios', fragmento: 'planes' },
    // Sección de opiniones de socios.
    { etiqueta: 'Opiniones', fragmento: 'testimonios' },
    // Sección de preguntas frecuentes.
    { etiqueta: 'Preguntas frecuentes', fragmento: 'faq' },
  ];

  /** Enlaces directos a los distintos planes de membresía. */
  readonly enlacesMembresias: readonly EnlaceFooter[] = [
    // Plan de entrada.
    { etiqueta: 'Pase Básico', fragmento: 'planes' },
    // Plan intermedio.
    { etiqueta: 'Pase PRO Total', fragmento: 'planes' },
    // Plan premium con entrenamiento personal.
    { etiqueta: 'Plan Elite 1 a 1', fragmento: 'planes' },
    // Acceso a la comparativa de planes.
    { etiqueta: 'Comparar planes', fragmento: 'planes' },
  ];

  /** Desplaza la vista al inicio de la página con un desplazamiento suave. */
  volverArriba(): void {
    // Comprueba que existe `window` para evitar errores en renderizado del servidor.
    if (typeof window !== 'undefined') {
      // Desplaza la página hasta la parte superior de forma animada.
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
