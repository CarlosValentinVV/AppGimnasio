/**
 * Modelos de datos de la pantalla de perfil del usuario.
 *
 * Definen el contrato que consumen `PantallaUsuario` y sus componentes hijos.
 *
 * @author Carlos Valentin Santamaria
 * @version 1.0
 */

/** Datos públicos del usuario mostrados en la cabecera del perfil. */
export interface Usuario {
  /** Nombre y apellidos del usuario. */
  nombre: string;
  /** URL de la foto de perfil; vacía si se usan iniciales. */
  fotoUrl: string;
  /** Iniciales usadas como avatar cuando no hay foto. */
  iniciales: string;
  /** Nombre del plan de membresía contratado. */
  plan: string;
  /** Fecha en la que el usuario se hizo miembro. */
  miembroDesde: string;
  /** Nivel de atleta actual. */
  nivel: string;
  /** Puntos acumulados en el nivel actual. */
  puntosNivel: number;
  /** Puntos necesarios para alcanzar el siguiente nivel. */
  puntosSiguienteNivel: number;
  /** Ciudad de residencia del usuario. */
  ciudad: string;
}

/** Tarjeta de estadística del resumen del perfil. */
export interface EstadisticaUsuario {
  /** Identificador único de la estadística. */
  id: string;
  /** Icono representativo de la métrica. */
  icono: 'calendar' | 'flame' | 'clock' | 'trophy' | 'target';
  /** Valor principal ya formateado. */
  valor: string;
  /** Etiqueta descriptiva de la métrica. */
  etiqueta: string;
  /** Texto secundario con contexto adicional. */
  detalle: string;
}

/** Asistencias registradas en un día concreto de la semana. */
export interface AsistenciaDia {
  /** Abreviatura del día de la semana. */
  dia: string;
  /** Número de visitas realizadas ese día. */
  visitas: number;
}

/** Visita reciente mostrada en el historial del usuario. */
export interface VisitaReciente {
  /** Fecha de la visita. */
  fecha: string;
  /** Nombre completo del día de la semana. */
  diaSemana: string;
  /** Hora de entrada al gimnasio. */
  horaEntrada: string;
  /** Duración de la sesión. */
  duracion: string;
  /** Zona o clase en la que se entrenó. */
  zona: string;
}

/** Logro o medalla del sistema de gamificación. */
export interface Logro {
  /** Identificador único del logro. */
  id: string;
  /** Título del logro. */
  titulo: string;
  /** Descripción de la condición para conseguirlo. */
  descripcion: string;
  /** Icono representativo del logro. */
  icono: 'dumbbell' | 'flame' | 'clock' | 'trophy' | 'target' | 'star';
  /** Indica si el usuario ya ha conseguido el logro. */
  conseguido: boolean;
}

/** Dato personal o de contacto del usuario. */
export interface DatoPersonal {
  /** Icono representativo del dato. */
  icono: 'user' | 'mail' | 'phone' | 'cake' | 'ruler' | 'weight' | 'target';
  /** Etiqueta del dato. */
  etiqueta: string;
  /** Valor del dato. */
  valor: string;
}

/** Información de la membresía del usuario. */
export interface Membresia {
  /** Fecha de la próxima renovación. */
  proximaRenovacion: string;
  /** Estado actual del pago de la cuota. */
  estadoCuota: 'Al día' | 'Pendiente';
}

/** Progreso del objetivo mensual de visitas. */
export interface ObjetivoMensual {
  /** Días entrenados en el mes actual. */
  diasMes: number;
  /** Días que el usuario se ha propuesto entrenar. */
  meta: number;
}

/** Conjunto completo de datos de la pantalla de perfil. */
export interface PantallaUsuarioData {
  /** Datos públicos del usuario. */
  usuario: Usuario;
  /** Estadísticas principales del perfil. */
  estadisticas: EstadisticaUsuario[];
  /** Asistencias por día de la semana. */
  asistenciasSemana: AsistenciaDia[];
  /** Objetivo mensual de visitas. */
  objetivoMensual: ObjetivoMensual;
  /** Historial de visitas recientes. */
  visitasRecientes: VisitaReciente[];
  /** Logros del usuario. */
  logros: Logro[];
  /** Datos personales y de contacto. */
  datosPersonales: DatoPersonal[];
  /** Información de la membresía. */
  membresia: Membresia;
}

/** Pestañas disponibles en la pantalla de perfil. */
export type Pestana = 'resumen' | 'asistencia' | 'datos';
