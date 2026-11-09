export interface Usuario {
  nombre: string;
  fotoUrl: string;
  iniciales: string;
  plan: string;
  miembroDesde: string;
  nivel: string;
  puntosNivel: number;
  puntosSiguienteNivel: number;
  ciudad: string;
}

export interface EstadisticaUsuario {
  id: string;
  icono: 'calendar' | 'flame' | 'clock' | 'trophy' | 'target';
  valor: string;
  etiqueta: string;
  detalle: string;
}

export interface AsistenciaDia {
  dia: string;
  visitas: number;
}

export interface VisitaReciente {
  fecha: string;
  diaSemana: string;
  horaEntrada: string;
  duracion: string;
  zona: string;
}

export interface Logro {
  id: string;
  titulo: string;
  descripcion: string;
  icono: 'dumbbell' | 'flame' | 'clock' | 'trophy' | 'target' | 'star';
  conseguido: boolean;
}

export interface DatoPersonal {
  icono: 'user' | 'mail' | 'phone' | 'cake' | 'ruler' | 'weight' | 'target';
  etiqueta: string;
  valor: string;
}

export interface Membresia {
  proximaRenovacion: string;
  estadoCuota: 'Al día' | 'Pendiente';
}

export interface ObjetivoMensual {
  diasMes: number;
  meta: number;
}

export interface PantallaUsuarioData {
  usuario: Usuario;
  estadisticas: EstadisticaUsuario[];
  asistenciasSemana: AsistenciaDia[];
  objetivoMensual: ObjetivoMensual;
  visitasRecientes: VisitaReciente[];
  logros: Logro[];
  datosPersonales: DatoPersonal[];
  membresia: Membresia;
}

export type Pestana = 'resumen' | 'asistencia' | 'datos';
