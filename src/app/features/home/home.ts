import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  OnDestroy,
  signal
} from '@angular/core';

import { HOME_DATA } from './data/home.data';
import type { CategoriaClase, HomeData } from './models/home.models';
import { ThemeService } from '../../shared/services/theme.service';

/**
 * Categoría seleccionada en el filtro de clases. `todas` desactiva el filtro.
 */
type FiltroCategoria = 'todas' | CategoriaClase;

/**
 * Ciclo de facturación que el usuario puede elegir en la tabla de precios.
 */
type CicloFacturacion = 'mensual' | 'anual';

/**
 * Componente principal de la página de inicio (home).
 *
 * Muestra las estadísticas del gimnasio, sus características, las clases
 * filtradas por categoría, los planes de membresía, los testimonios de los
 * socios y las preguntas frecuentes. También gestiona el tema claro/oscuro y
 * las animaciones de aparición al hacer scroll.
 *
 * @author raulmoron
 * @version 1.0
 */
@Component({
  // Selector usado en las plantillas para insertar la página de inicio.
  selector: 'app-home',
  // Componente independiente, sin necesidad de declararlo en un módulo.
  standalone: true,
  // Optimiza el renderizado comprobando cambios solo cuando se notifican.
  changeDetection: ChangeDetectionStrategy.OnPush,
  // Plantilla HTML de la página de inicio.
  templateUrl: './home.html',
  // Hoja de estilos de la página de inicio.
  styleUrl: './home.css',
  // Clases que se aplican dinámicamente al elemento anfitrión.
  host: {
    // Activa los estilos oscuros cuando el tema lo indica.
    '[class.modo-oscuro]': 'isDarkMode()',
    // Activa los estilos claros en caso contrario.
    '[class.modo-claro]': '!isDarkMode()',
  },
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  /** Datos estáticos de la página, expuestos como señal para la plantilla. */
  readonly data = signal<HomeData>(HOME_DATA);
  /** Categoría activa del filtro de clases. */
  readonly selectedCategory = signal<FiltroCategoria>('todas');
  /** Ciclo de facturación seleccionado en la sección de planes. */
  readonly billingCycle = signal<CicloFacturacion>('mensual');
  /** Índice de la pregunta frecuente abierta, o `null` si están todas cerradas. */
  readonly openFaqIndex = signal<number | null>(0);
  /** Clases visibles según la categoría seleccionada. */
  readonly filteredClasses = computed(() => {
    // Recupera la categoría activa.
    const categoria = this.selectedCategory();
    // Si no hay filtro, devuelve todas las clases.
    if (categoria === 'todas') {
      return this.data().classes;
    }
    // En caso contrario, filtra por la categoría seleccionada.
    return this.data().classes.filter((clase) => clase.category === categoria);
  });
  /** Servicio compartido que controla el tema claro/oscuro. */
  private readonly themeService = inject(ThemeService);
  /** Indica si el modo oscuro está activo. */
  readonly isDarkMode = this.themeService.isDarkMode;
  /** Referencia al elemento anfitrión, usada por el observador de scroll. */
  private readonly elementRef = inject(ElementRef);
  /** Observador que revela los elementos `.reveal` cuando entran en pantalla. */
  private observer: IntersectionObserver | null = null;

  /**
   * Inicializa el observador de scroll una vez renderizada la vista.
   */
  ngAfterViewInit(): void {
    // Crea el observador cuando el DOM ya está disponible.
    this.initScrollObserver();
  }

  /**
   * Libera el observador de scroll al destruir el componente para evitar
   * fugas de memoria.
   */
  ngOnDestroy(): void {
    // Comprueba que el observador llegó a crearse.
    if (this.observer) {
      // Deja de observar los elementos y libera sus recursos.
      this.observer.disconnect();
    }
  }

  /**
   * Alterna el modo claro/oscuro de la aplicación.
   */
  toggleTheme(): void {
    // Delega el cambio en el servicio compartido.
    this.themeService.toggle();
  }

  /**
   * Cambia la categoría del filtro de clases y vuelve a observar los nuevos
   * elementos para que también se animen.
   *
   * @param category Categoría a mostrar.
   */
  setCategory(category: FiltroCategoria): void {
    // Actualiza la categoría activa.
    this.selectedCategory.set(category);
    // Vuelve a registrar los elementos recién renderizados.
    this.refreshObserver();
  }

  /**
   * Cambia el ciclo de facturación mostrado en los planes.
   *
   * @param cycle Ciclo de facturación (`mensual` o `anual`).
   */
  setBillingCycle(cycle: CicloFacturacion): void {
    // Actualiza el ciclo de facturación seleccionado.
    this.billingCycle.set(cycle);
  }

  /**
   * Abre la pregunta indicada o la cierra si ya estaba abierta.
   *
   * @param index Posición de la pregunta dentro de la lista de FAQs.
   */
  toggleFaq(index: number): void {
    // Alterna entre la pregunta pulsada y el estado cerrado.
    this.openFaqIndex.update((current) => (current === index ? null : index));
  }

  /**
   * Crea el observador que añade la clase `is-visible` a los elementos
   * `.reveal` cuando entran en el viewport.
   */
  private initScrollObserver(): void {
    // Evita errores si no existe `window` o el navegador no soporta la API.
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

    // Crea el observador con el umbral y el margen configurados.
    this.observer = new IntersectionObserver(
      (entries) => {
        // Recorre cada elemento observado.
        entries.forEach((entry) => {
          // Cuando el elemento entra en pantalla, lo marca como visible.
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      {
        // Se considera visible al mostrar un 10 % del elemento.
        threshold: 0.1,
        // Se adelanta ligeramente el disparo antes del borde inferior.
        rootMargin: '0px 0px -40px 0px',
      },
    );

    // Registra los elementos `.reveal` que ya existen.
    this.refreshObserver();
  }

  /**
   * Registra en el observador todos los elementos `.reveal` actuales.
   *
   * Se ejecuta en un temporizador para esperar a que Angular termine de
   * renderizar los elementos creados por el filtro de clases.
   */
  private refreshObserver(): void {
    // Espera 50 ms para que la vista se actualice antes de buscar elementos.
    setTimeout(() => {
      // Comprueba que el observador sigue activo.
      if (this.observer && this.elementRef) {
        // Busca todos los elementos que deben animarse.
        const elements = this.elementRef.nativeElement.querySelectorAll('.reveal');
        // Registra cada elemento en el observador de scroll.
        elements.forEach((el: Element) => this.observer?.observe(el));
      }
    }, 50);
  }
}
