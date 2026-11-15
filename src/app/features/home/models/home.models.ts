/**
 * Modelos de datos de la página de inicio (home).
 *
 * Centralizan la forma de los datos que consume `HomeComponent`, de modo que
 * los datos estáticos y las plantillas compartan un único contrato tipado.
 *
 * @author Carlos Valentin Santamaria
 * @version 1.0
 */

/**
 * Estadística destacada que se muestra en la franja inferior del hero.
 */
export interface HomeStat {
  /** Texto descriptivo de la métrica. */
  label: string;
  /** Valor ya formateado que se muestra al usuario. */
  value: string;
}

/**
 * Característica o ventaja del gimnasio mostrada en la sección "Por qué elegirnos".
 */
export interface HomeFeature {
  /** Nombre del icono que representa la característica. */
  icon: string;
  /** Título de la característica. */
  title: string;
  /** Descripción breve de la característica. */
  description: string;
}

/**
 * Categoría a la que pertenece una clase dirigida.
 */
export type CategoriaClase = 'fuerza' | 'cardio' | 'mente';

/**
 * Nivel de intensidad de una clase dirigida.
 */
export type IntensidadClase = 'Alta' | 'Media' | 'Baja' | 'Muy Alta';

/**
 * Clase dirigida ofrecida por el gimnasio.
 */
export interface GymClass {
  /** Identificador único de la clase. */
  id: string;
  /** Nombre comercial de la clase. */
  name: string;
  /** Categoría usada por los filtros de la página. */
  category: CategoriaClase;
  /** Duración aproximada de la sesión. */
  duration: string;
  /** Intensidad física de la sesión. */
  intensity: IntensidadClase;
  /** Nombre del entrenador que imparte la clase. */
  trainer: string;
  /** Descripción de los beneficios y el contenido de la clase. */
  description: string;
  /** Etiqueta promocional corta (por ejemplo, "Más Popular"). */
  tag: string;
}

/**
 * Elemento de la sección de preguntas frecuentes.
 */
export interface FaqItem {
  /** Pregunta planteada por el usuario. */
  question: string;
  /** Respuesta que se despliega al abrir la pregunta. */
  answer: string;
}

/**
 * Testimonio de un cliente del gimnasio.
 */
export interface opinions {
  /** Nombre del socio. */
  name: string;
  /** Antigüedad o rol del socio. */
  role: string;
  /** Iniciales usadas como avatar cuando no hay imagen. */
  avatar: string;
  /** Texto del testimonio. */
  text: string;
  /** Resultado o logro destacado del socio. */
  achievement: string;
  /** Puntuación otorgada, de 1 a 5. */
  rating: number;
}

/**
 * Plan de membresía disponible en la página de precios.
 */
export interface Plan {
  /** Nombre del plan. */
  name: string;
  /** Subtítulo que resume a quién va dirigido. */
  sub: string;
  /** Precio mensual en euros (sin símbolo). */
  mensual: string;
  /** Precio mensual equivalente al pagar de forma anual. */
  anual: string;
  /** Beneficios incluidos en el plan. */
  features: string[];
  /** Beneficios que no incluye el plan. */
  inactives?: string[];
  /** Indica si el plan se destaca como el más popular. */
  popular?: boolean;
}

/**
 * Conjunto completo de datos estáticos de la página de inicio.
 */
export interface HomeData {
  /** Métricas destacadas del hero. */
  stats: HomeStat[];
  /** Ventajas competitivas del gimnasio. */
  features: HomeFeature[];
  /** Catálogo de clases dirigidas. */
  classes: GymClass[];
  /** Planes de membresía. */
  plans: Plan[];
  /** Opiniones de los socios. */
  opinions: opinions[];
  /** Preguntas frecuentes. */
  faqs: FaqItem[];
}
