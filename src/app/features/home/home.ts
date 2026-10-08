import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface FeaturedClass {
  id: number;
  title: string;
  category: string;
  image: string;
  time: string;
  spotsLeft: number;
  instructor: string;
  level: string;
}

interface Program {
  id: number;
  title: string;
  weeks: number;
  level: string;
  category: string;
  image: string;
  badge?: string;
}

interface Trainer {
  id: number;
  name: string;
  specialty: string;
  rating: number;
  reviewsCount: number;
  image: string;
}

interface ServiceOffer {
  id: number;
  title: string;
  description: string;
  price: string;
  badge: string;
  icon: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent {
  selectedCategory = 'all';

  categories: Category[] = [
    { id: 'all', name: 'Todo', icon: '🔥' },
    { id: 'fuerza', name: 'Fuerza', icon: '🏋️‍♂️' },
    { id: 'cardio', name: 'Cardio & HIIT', icon: '🏃‍♂️' },
    { id: 'mind', name: 'Yoga & Pilates', icon: '🧘‍♀️' },
    { id: 'crossfit', name: 'CrossFit', icon: '⚡' },
    { id: 'boxeo', name: 'Boxeo', icon: '🥊' }
  ];

  featuredClasses: FeaturedClass[] = [
    {
      id: 1,
      title: 'CrossFit WOD de Alta Intensidad',
      category: 'crossfit',
      image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop',
      time: 'Hoy, 18:00 - 19:00',
      spotsLeft: 3,
      instructor: 'Carlos Ramos',
      level: 'Avanzado'
    },
    {
      id: 2,
      title: 'Power Yoga & Flexibilidad',
      category: 'mind',
      image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=600&auto=format&fit=crop',
      time: 'Hoy, 19:30 - 20:30',
      spotsLeft: 5,
      instructor: 'Elena Vega',
      level: 'Todos los niveles'
    },
    {
      id: 3,
      title: 'Spinning Virtual Beats',
      category: 'cardio',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop',
      time: 'Mañana, 09:00 - 09:45',
      spotsLeft: 2,
      instructor: 'David Maza',
      level: 'Intermedio'
    },
    {
      id: 4,
      title: 'Boxeo & Functional Training',
      category: 'boxeo',
      image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?q=80&w=600&auto=format&fit=crop',
      time: 'Mañana, 18:30 - 19:30',
      spotsLeft: 8,
      instructor: 'Laura Prieto',
      level: 'Principiante / Intermedio'
    }
  ];

  programs: Program[] = [
    {
      id: 101,
      title: 'Transformación Hipertrofia 12 Semanas',
      weeks: 12,
      level: 'Intermedio - Avanzado',
      category: 'fuerza',
      image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=600&auto=format&fit=crop',
      badge: 'Más Popular'
    },
    {
      id: 102,
      title: 'Pérdida de Grasa & Tono Express',
      weeks: 6,
      level: 'Principiante',
      category: 'cardio',
      image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=600&auto=format&fit=crop',
      badge: 'Recomendado'
    },
    {
      id: 103,
      title: 'Dominio de Calistenia y Control Corporal',
      weeks: 8,
      level: 'Intermedio',
      category: 'fuerza',
      image: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=600&auto=format&fit=crop'
    }
  ];

  trainers: Trainer[] = [
    {
      id: 1,
      name: 'Marcos Rubio',
      specialty: 'Especialista en Fuerza y Powerlifting',
      rating: 4.9,
      reviewsCount: 124,
      image: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?q=80&w=300&auto=format&fit=crop'
    },
    {
      id: 2,
      name: 'Sofía Benítez',
      specialty: 'Entrenadora Personal & Nutricionista',
      rating: 5.0,
      reviewsCount: 98,
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format&fit=crop'
    },
    {
      id: 3,
      name: 'Javier Soria',
      specialty: 'CrossFit Head Coach & Movilidad',
      rating: 4.8,
      reviewsCount: 156,
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop'
    }
  ];

  services: ServiceOffer[] = [
    {
      id: 1,
      title: 'Sesión de Fisioterapia Deportiva',
      description: 'Tratamiento de descargas musculares y prevención de lesiones.',
      price: '35€ / sesión',
      badge: 'Salud',
      icon: '🩺'
    },
    {
      id: 2,
      title: 'Estudio Nutricional + Bioimpedancia',
      description: 'Dieta personalizada con análisis semanal de masa muscular y grasa.',
      price: '29€ / mes',
      badge: 'Nutrición',
      icon: '🥗'
    },
    {
      id: 3,
      title: 'Pase VIP Amigo (Fin de Semana)',
      description: 'Trae a un acompañante gratis los sábados y domingos.',
      price: 'Gratis este mes',
      badge: 'Promoción',
      icon: '🎟️'
    }
  ];

  selectCategory(catId: string): void {
    this.selectedCategory = catId;
  }

  get filteredClasses(): FeaturedClass[] {
    if (this.selectedCategory === 'all') {
      return this.featuredClasses;
    }
    return this.featuredClasses.filter(c => c.category === this.selectedCategory);
  }
}