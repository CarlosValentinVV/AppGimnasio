import type { PantallaUsuarioData } from '../models/usuario.models';

/**
 * Datos estáticos de la pantalla de perfil del usuario.
 *
 * Viven en un módulo TypeScript (en lugar de un JSON) para que el compilador
 * valide su estructura contra {@link PantallaUsuarioData} y para poder
 * importarlos con tipado estricto sin depender de `resolveJsonModule`.
 *
 * @author raulmoron
 * @version 1.0
 */
export const DATOS_PANTALLA_USUARIO: PantallaUsuarioData = {
  // Datos públicos del usuario mostrados en la cabecera.
  usuario: {
    nombre: 'Carlos García López',
    fotoUrl: '',
    iniciales: 'DV',
    plan: 'Plan Pro',
    miembroDesde: 'Marzo 2024',
    nivel: 'Atleta Nivel 7',
    puntosNivel: 640,
    puntosSiguienteNivel: 800,
    ciudad: 'Madrid',
  },
  // Tarjetas de estadísticas del resumen.
  estadisticas: [
    {
      id: 'dias-totales',
      icono: 'calendar',
      valor: '128',
      etiqueta: 'Días entrenados',
      detalle: 'Desde que eres miembro',
    },
    {
      id: 'dias-mes',
      icono: 'target',
      valor: '14',
      etiqueta: 'Días este mes',
      detalle: 'Objetivo mensual: 20 días',
    },
    {
      id: 'racha',
      icono: 'flame',
      valor: '5',
      etiqueta: 'Racha actual',
      detalle: 'Tu mejor racha: 21 días',
    },
    {
      id: 'horas',
      icono: 'clock',
      valor: '96h',
      etiqueta: 'Horas entrenadas',
      detalle: 'Media de 1h 15m por sesión',
    },
  ],
  // Asistencias registradas para cada día de la semana.
  asistenciasSemana: [
    { dia: 'Lun', visitas: 2 },
    { dia: 'Mar', visitas: 1 },
    { dia: 'Mié', visitas: 2 },
    { dia: 'Jue', visitas: 0 },
    { dia: 'Vie', visitas: 1 },
    { dia: 'Sáb', visitas: 2 },
    { dia: 'Dom', visitas: 0 },
  ],
  // Progreso del objetivo mensual de visitas.
  objetivoMensual: { diasMes: 14, meta: 20 },
  // Historial de las últimas visitas al gimnasio.
  visitasRecientes: [
    {
      fecha: '8 Nov',
      diaSemana: 'Sábado',
      horaEntrada: '10:15',
      duracion: '1h 25m',
      zona: 'Sala de pesas',
    },
    {
      fecha: '7 Nov',
      diaSemana: 'Viernes',
      horaEntrada: '18:40',
      duracion: '55m',
      zona: 'Clase de Indoor Cycling',
    },
    {
      fecha: '5 Nov',
      diaSemana: 'Miércoles',
      horaEntrada: '07:30',
      duracion: '1h 10m',
      zona: 'Zona de cardio',
    },
    {
      fecha: '4 Nov',
      diaSemana: 'Martes',
      horaEntrada: '19:05',
      duracion: '1h 30m',
      zona: 'Sala de pesas',
    },
  ],
  // Logros del sistema de gamificación.
  logros: [
    {
      id: 'primer-mes',
      titulo: 'Primer mes',
      descripcion: 'Entrenaste 12 días en tu primer mes',
      icono: 'star',
      conseguido: true,
    },
    {
      id: 'racha-10',
      titulo: 'Racha de fuego',
      descripcion: '10 días seguidos entrenando',
      icono: 'flame',
      conseguido: true,
    },
    {
      id: 'madrugador',
      titulo: 'Madrugador',
      descripcion: '20 entrenamientos antes de las 8:00',
      icono: 'clock',
      conseguido: true,
    },
    {
      id: 'cien-dias',
      titulo: 'Centenario',
      descripcion: '100 días entrenados en el gym',
      icono: 'trophy',
      conseguido: true,
    },
    {
      id: 'racha-30',
      titulo: 'Imparable',
      descripcion: '30 días seguidos entrenando',
      icono: 'dumbbell',
      conseguido: false,
    },
    {
      id: 'maraton',
      titulo: 'Maratón anual',
      descripcion: '250 días entrenados en un año',
      icono: 'target',
      conseguido: false,
    },
  ],
  // Datos personales y de contacto del usuario.
  datosPersonales: [
    { icono: 'user', etiqueta: 'Nombre completo', valor: 'Carlos García López' },
    { icono: 'mail', etiqueta: 'Email', valor: 'carlos.garcia@email.com' },
    { icono: 'phone', etiqueta: 'Teléfono', valor: '+34 600 123 456' },
    { icono: 'cake', etiqueta: 'Fecha de nacimiento', valor: '12 de junio de 1995' },
    { icono: 'ruler', etiqueta: 'Altura', valor: '178 cm' },
    { icono: 'weight', etiqueta: 'Peso', valor: '76 kg' },
    {
      icono: 'target',
      etiqueta: 'Objetivo',
      valor: 'Ganar masa muscular y mejorar resistencia',
    },
  ],
  // Información de la membresía activa y su estado de pago.
  membresia: {
    proximaRenovacion: '15 de diciembre de 2026',
    estadoCuota: 'Al día',
  },
};
