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
  readonly isDarkMode = signal<boolean>(false);
  readonly mobileMenuOpen = signal(false);
  readonly selectedCategory = signal<'todas' | 'fuerza' | 'cardio' | 'mente'>('todas');
  readonly billingCycle = signal<'mensual' | 'anual'>('mensual');
  readonly openFaqIndex = signal<number | null>(0);
  readonly stats = signal([
    { label: 'Superficie de entrenamiento', value: '1.800 m²' },
    { label: 'Clases semanales dirigidas', value: '+20' },
    { label: 'Valoración de miembros', value: '4.9 / 5' },
    { label: 'Entrenadores certificados', value: '100%' },
  ]);
  readonly features = signal([
    {
      icon: 'dumbbell',
      title: 'Zona de Musculación Premium',
      description:
        'Equipamiento de máxima precisión Hammer Strength y Eleiko para atletas de todos los niveles.',
    },
    {
      icon: 'calendar',
      title: '+20 Clases a la Semana',
      description:
        'Crossfit, Spinning, Yoga, Boxing, Pilates y HIIT guiados por técnicos titulados.',
    },
    {
      icon: 'user-check',
      title: 'Corrección Técnica 1 a 1',
      description:
        'Nuestros entrenadores supervisan tu ejecución en sala para prevenir lesiones y maximizar tu progreso.',
    },
    {
      icon: 'clock',
      title: 'Horario Ininterrumpido',
      description:
        'Abierto 365 días al año. De Lunes a Viernes de 06:00 a 23:00 h. Sábados y Domingos de 08:00 a 20:00 h.',
    },
  ]);
  readonly classesList = signal<GymClass[]>([
    {
      id: '1',
      name: 'Cross Training & Fuerza',
      category: 'fuerza',
      duration: '50 min',
      intensity: 'Alta',
      trainer: 'Carlos Ruiz',
      tag: 'Más Popular',
      description:
        'Desarrolla fuerza bruta, resistencia muscular y quema de grasa con circuitos metabólicos intensos.',
    },
    {
      id: '2',
      name: 'Power Indoor Cycling',
      category: 'cardio',
      duration: '45 min',
      intensity: 'Alta',
      trainer: 'Elena Gómez',
      tag: 'Alta Quema',
      description:
        'Sesión de ciclismo indoor con ritmo cardiaco optimizado, iluminación inmersiva y música motivadora.',
    },
    {
      id: '3',
      name: 'Vinyasa Yoga & Mobility',
      category: 'mente',
      duration: '60 min',
      intensity: 'Media',
      trainer: 'Sofía Martínez',
      tag: 'Recuperación',
      description:
        'Mejora tu flexibilidad, movilidad articular, higiene postural y elimina el estrés diario.',
    },
    {
      id: '4',
      name: 'Boxing Conditioning',
      category: 'cardio',
      duration: '55 min',
      intensity: 'Muy Alta',
      trainer: 'David Navarro',
      tag: 'Combate',
      description:
        'Aprende golpeo técnico sobre saco combinado con ejercicios de agilidad y fuerza explosiva.',
    },
    {
      id: '5',
      name: 'Pilates Core & Spine',
      category: 'mente',
      duration: '50 min',
      intensity: 'Media',
      trainer: 'Lucía Torres',
      tag: 'Postura',
      description:
        'Refuerza tu faja abdominal, suelo pélvico y estabilizadores espinales para un cuerpo funcional.',
    },
    {
      id: '6',
      name: 'HIIT Tabata Surge',
      category: 'cardio',
      duration: '40 min',
      intensity: 'Muy Alta',
      trainer: 'Alex Rodríguez',
      tag: 'Express',
      description:
        'Intervalos explosivos de alta intensidad para acelerar tu consumo de oxígeno metabólico.',
    },
  ]);
  readonly filteredClasses = computed(() => {
    const cat = this.selectedCategory();
    if (cat === 'todas') {
      return this.classesList();
    }
    return this.classesList().filter((c) => c.category === cat);
  });
  readonly testimonials = signal<Testimonial[]>([
    {
      name: 'Marcos Alonso',
      role: 'Socio desde 2023',
      avatar: 'MA',
      text: 'El ambiente es brutal y los entrenadores realmente están encima tuyo corrigiendo cada sentadilla o peso muerto. He mejorado más en 6 meses aquí que en años en otros gimnasios.',
      achievement: '-12kg y +8kg de masa magra',
      rating: 5,
    },
    {
      name: 'Laura Fernández',
      role: 'Socia desde 2024',
      avatar: 'LF',
      text: 'Empecé con la semana gratis y me quedé por la variedad de clases. El área de Spinning y Cross Training son una pasada. Instalaciones impolutas.',
      achievement: 'Asistencia 4 días/semana',
      rating: 5,
    },
    {
      name: 'Javier Gutiérrez',
      role: 'Socio desde 2022',
      avatar: 'JG',
      text: 'La maquinaria es top y el ambiente muy respetuoso. Además, la flexibilidad de horarios me permite entrenar a las 6:00 am antes de trabajar.',
      achievement: 'Objetivo de fuerza alcanzado',
      rating: 5,
    },
  ]);
  readonly faqs = signal<FaqItem[]>([
    {
      question: '¿En qué consiste la primera semana gratis?',
      answer:
        'Tendrás acceso 100% ilimitado durante 7 días consecutivos tanto a la sala de musculación como a las más de 20 clases dirigidas semanales. Sin compromiso y sin introducir tarjeta bancaria para probar.',
    },
    {
      question: '¿Tengo que reservar plaza para las clases dirigidas?',
      answer:
        'Recomendamos reservar con 24h de antelación desde nuestra aplicación o en recepción para asegurar tu sitio, aunque también puedes entrar directamente si hay plazas libres.',
    },
    {
      question: '¿Los planes tienen permanencia o permanencia mínima?',
      answer:
        'Ninguno de nuestros pases mensuales tiene permanencia. Puedes darte de baja o pausar tu suscripción en cualquier momento sin penalizaciones.',
    },
    {
      question: '¿Disponéis de vestuarios, duchas y taquillas?',
      answer:
        'Sí, disponemos de amplios vestuarios climatizados con duchas individuales de agua caliente, secadores de pelo y taquillas de uso gratuito con candado o pulsera sin contacto.',
    },
    {
      question: '¿Dónde está ubicado el gimnasio y cómo contactar?',
      answer:
        'Estamos en Calle del Hierro, 12, Madrid. Puedes llamarnos al 910 000 000 o escribirnos a hola@Jimnasiogym.es.',
    },
  ]);
  private readonly elementRef = inject(ElementRef);
  private observer: IntersectionObserver | null = null;

  ngAfterViewInit(): void {
    this.initScrollObserver();
  }

  toggleTheme(): void {
    this.isDarkMode.update((dark) => !dark);
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update((open) => !open);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  setCategory(category: 'todas' | 'fuerza' | 'cardio' | 'mente'): void {
    this.selectedCategory.set(category);
    setTimeout(() => {
      if (this.observer && this.elementRef) {
        const elements = this.elementRef.nativeElement.querySelectorAll('.reveal');
        elements.forEach((el: Element) => this.observer?.observe(el));
      }
    }, 50);
  }

  setBillingCycle(cycle: 'mensual' | 'anual'): void {
    this.billingCycle.set(cycle);
  }

  toggleFaq(index: number): void {
    this.openFaqIndex.update((current) => (current === index ? null : index));
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
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

    const elements = this.elementRef.nativeElement.querySelectorAll('.reveal');
    elements.forEach((el: Element) => this.observer?.observe(el));
  }
}
