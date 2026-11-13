import type { HomeData } from '../models/home.models';

/**
 * Datos estáticos de la página de inicio.
 *
 * Se mantienen en un módulo TypeScript (en lugar de un JSON) para que el
 * compilador valide la estructura contra {@link HomeData} y para poder
 * importarlos con tipado estricto sin depender de `resolveJsonModule`.
 *
 * @author Carlos Valentin Santamaria
 * @version 1.0
 */
export const HOME_DATA: HomeData = {
  // Métricas destacadas que se muestran en la franja del hero.
  stats: [
    // Superficie total de entrenamiento.
    { label: 'Superficie de entrenamiento', value: '1.800 m²' },
    // Número de clases dirigidas por semana.
    { label: 'Clases semanales dirigidas', value: '+20' },
    // Valoración media de los miembros.
    { label: 'Valoración de miembros', value: '2 / 5' },
    // Porcentaje de entrenadores titulados.
    { label: 'Entrenadores certificados', value: '100%' },
  ],
  // Ventajas competitivas del gimnasio.
  features: [
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
  ],
  // Catálogo de clases dirigidas que se puede filtrar por categoría.
  classes: [
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
  ],
  // Planes de membresía disponibles.
  plans: [
    {
      name: 'Pase Básico',
      sub: 'Para entrenar por tu cuenta',
      mensual: '29',
      anual: '24',
      features: [
        'Acceso ilimitado a sala de pesas y cardio',
        'Vestuarios, duchas y taquilla gratuita',
        'App móvil de seguimiento básico',
      ],
      inactives: ['Clases dirigidas semanales', 'Evaluación nutricional inicial'],
    },
    {
      name: 'Pase PRO Total',
      sub: 'Acceso total + todas las clases',
      mensual: '45',
      anual: '36',
      popular: true,
      features: [
        'Primera semana 100% gratis',
        'Acceso ilimitado a sala de musculación',
        'Acceso total a +20 clases dirigidas',
        'Asesoramiento técnico en sala continuo',
        'Evaluación corporal y nutricional inicial',
        'Vestuarios VIP y taquillas electrónicas',
      ],
    },
    {
      name: 'Plan Elite 1 a 1',
      sub: 'Entrenamiento personal + nutrición',
      mensual: '89',
      anual: '75',
      features: [
        'Todo lo incluido en el Pase PRO',
        '4 Sesiones de Entrenamiento Personal/mes',
        'Plan de nutrición deportiva a medida',
        'Medición mensual por Bioimpedancia',
        'Soporte prioritario por WhatsApp',
      ],
    },
  ],
  // Opiniones de socios que refuerzan la confianza en el gimnasio.
  opinions: [
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
  ],
  // Preguntas frecuentes que resuelven las dudas más habituales.
  faqs: [
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
  ],
};
