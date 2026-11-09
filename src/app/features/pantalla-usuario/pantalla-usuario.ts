import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import datosPantalla from './pantalla-usuario.json';

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

export interface PantallaUsuarioData {
  usuario: Usuario;
  estadisticas: EstadisticaUsuario[];
  asistenciasSemana: AsistenciaDia[];
  objetivoMensual: { diasMes: number; meta: number };
  visitasRecientes: VisitaReciente[];
  logros: Logro[];
  datosPersonales: DatoPersonal[];
  membresia: Membresia;
}

export type Pestana = 'resumen' | 'asistencia' | 'datos';

@Component({
  selector: 'app-pantalla-usuario',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './pantalla-usuario.html',
  styleUrl: './pantalla-usuario.css',
  host: {
    '[class.modo-oscuro]': 'isDarkMode()',
    '[class.modo-claro]': '!isDarkMode()',
  },
})
export class PantallaUsuario {
  readonly isDarkMode = signal<boolean>(false);
  readonly pestanaActiva = signal<Pestana>('resumen');
  readonly maxVisitasSemana = computed(() =>
    Math.max(...this.asistenciasSemana().map((a) => a.visitas), 1),
  );
  readonly visitasSemanaTotal = computed(() =>
    this.asistenciasSemana().reduce((total, dia) => total + dia.visitas, 0),
  );
  readonly porcentajeObjetivo = computed(
    () => Math.round((this.diasMes() / this.objetivoMensual()) * 100) || 0,
  );
  readonly porcentajeNivel = computed(
    () => Math.round((this.usuario().puntosNivel / this.usuario().puntosSiguienteNivel) * 100) || 0,
  );
  // Ajuste para importar JSON correctamente en entornos modernos
  private readonly datos: PantallaUsuarioData = datosPantalla as unknown as PantallaUsuarioData;
  readonly usuario = signal<Usuario>(this.datos.usuario);
  readonly estadisticas = signal<EstadisticaUsuario[]>(this.datos.estadisticas);
  readonly asistenciasSemana = signal<AsistenciaDia[]>(this.datos.asistenciasSemana);
  readonly visitasRecientes = signal<VisitaReciente[]>(this.datos.visitasRecientes);
  readonly logros = signal<Logro[]>(this.datos.logros);
  readonly datosPersonales = signal<DatoPersonal[]>(this.datos.datosPersonales);
  readonly membresia = signal<Membresia>(this.datos.membresia);
  readonly diasMes = signal<number>(this.datos.objetivoMensual.diasMes);
  readonly objetivoMensual = signal<number>(this.datos.objetivoMensual.meta);

  setPestana(pestana: Pestana): void {
    this.pestanaActiva.set(pestana);
  }

  toggleTheme(): void {
    this.isDarkMode.update((dark) => !dark);
  }
}
