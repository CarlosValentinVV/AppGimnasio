import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  OnDestroy,
  signal,
} from '@angular/core';

import { ThemeService } from '../../shared/services/theme.service';
import homeData from './home.json';

export interface GymClass {
  id: string;
  name: string;
  category: 'fuerza' | 'cardio' | 'mente';
  duration: string;
  intensity: 'Alta' | 'Media' | 'Baja' | 'Muy Alta';
  trainer: string;
  description: string;
  tag: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Testimonial {
  name: string;
  role: string;
  avatar: string;
  text: string;
  achievement: string;
  rating: number;
}

export interface Plan {
  name: string;
  sub: string;
  mensual: string;
  anual: string;
  features: string[];
  inactives?: string[];
  popular?: boolean;
}

export interface HomeData {
  stats: { label: string; value: string }[];
  features: { icon: string; title: string; description: string }[];
  classes: GymClass[];
  plans: Plan[];
  testimonials: Testimonial[];
  faqs: FaqItem[];
}

@Component({
  selector: 'app-home',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.html',
  styleUrl: './home.css',
  host: {
    '[class.modo-oscuro]': 'isDarkMode()',
    '[class.modo-claro]': '!isDarkMode()',
  },
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  // Ajuste para importar JSON correctamente en entornos modernos
  readonly data = signal<HomeData>(homeData as unknown as HomeData);
  readonly filteredClasses = computed(() => {
    const cat = this.selectedCategory();
    if (cat === 'todas') {
      return this.data().classes;
    }
    return this.data().classes.filter((c) => c.category === cat);
  });

  private readonly themeService = inject(ThemeService);
  readonly isDarkMode = this.themeService.isDarkMode;
  readonly selectedCategory = signal<'todas' | 'fuerza' | 'cardio' | 'mente'>('todas');
  readonly billingCycle = signal<'mensual' | 'anual'>('mensual');
  readonly openFaqIndex = signal<number | null>(0);
  private readonly elementRef = inject(ElementRef);
  private observer: IntersectionObserver | null = null;

  ngAfterViewInit(): void {
    this.initScrollObserver();
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  toggleTheme(): void {
    this.themeService.toggle();
  }

  setCategory(category: 'todas' | 'fuerza' | 'cardio' | 'mente'): void {
    this.selectedCategory.set(category);
    this.refreshObserver();
  }

  setBillingCycle(cycle: 'mensual' | 'anual'): void {
    this.billingCycle.set(cycle);
  }

  toggleFaq(index: number): void {
    this.openFaqIndex.update((current) => (current === index ? null : index));
  }

  private initScrollObserver(): void {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px',
      },
    );

    this.refreshObserver();
  }

  private refreshObserver(): void {
    setTimeout(() => {
      if (this.observer && this.elementRef) {
        const elements = this.elementRef.nativeElement.querySelectorAll('.reveal');
        elements.forEach((el: Element) => this.observer?.observe(el));
      }
    }, 50);
  }
}
