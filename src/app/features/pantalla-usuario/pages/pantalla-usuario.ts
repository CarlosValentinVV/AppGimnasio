import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { ThemeService } from '../../../shared/services/theme.service';
import { AnilloObjetivo } from '../components/anillo-objetivo/anillo-objetivo';
import { EstadisticasPerfil } from '../components/estadisticas-perfil/estadisticas-perfil';
import { GraficoAsistencia } from '../components/grafico-asistencia/grafico-asistencia';
import { ListaDatos } from '../components/lista-datos/lista-datos';
import { ListaLogros } from '../components/lista-logros/lista-logros';
import { ListaVisitas } from '../components/lista-visitas/lista-visitas';
import { PerfilCabecera } from '../components/perfil-cabecera/perfil-cabecera';
import { TarjetaMembresia } from '../components/tarjeta-membresia/tarjeta-membresia';
import datosPantalla from '../data/usuario.json';
import {
  AsistenciaDia,
  DatoPersonal,
  EstadisticaUsuario,
  Logro,
  Membresia,
  ObjetivoMensual,
  PantallaUsuarioData,
  Pestana,
  Usuario,
  VisitaReciente,
} from '../models/usuario.models';

/**
 * Pantalla de perfil del cliente (usuario).
 * Muestra estadísticas, gráfico de asistencia, objetivo mensual, logros,
 * visitas recientes, datos personales y membresía, organizados en pestañas
 * (Resumen, Asistencia, Datos).
 *
 * @author Equipo Jimnasio
 * @version 1.0
 */
@Component({
  selector: 'app-pantalla-usuario',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AnilloObjetivo,
    EstadisticasPerfil,
    GraficoAsistencia,
    ListaDatos,
    ListaLogros,
    ListaVisitas,
    PerfilCabecera,
    TarjetaMembresia,
  ],
  templateUrl: './pantalla-usuario.html',
  styleUrl: './pantalla-usuario.css',
  host: {
    '[class.modo-oscuro]': 'isDarkMode()',
    '[class.modo-claro]': '!isDarkMode()',
  },
})
export class PantallaUsuario {
  private readonly themeService = inject(ThemeService);

  /** Indica si el modo oscuro está activo. */
  readonly isDarkMode = this.themeService.isDarkMode;

  /** Pestaña actualmente activa: 'resumen', 'asistencia' o 'datos'. */
  readonly pestanaActiva = signal<Pestana>('resumen');
  /** Datos del usuario logueado. */
  readonly usuario = signal<Usuario>(this.datos.usuario);

  // Ajuste para importar JSON correctamente en entornos modernos
  private readonly datos: PantallaUsuarioData = datosPantalla as unknown as PantallaUsuarioData;
  /** Porcentaje de progreso hacia el siguiente nivel. */
  readonly porcentajeNivel = computed(() => {
    const siguiente = this.usuario().puntosSiguienteNivel;
    if (!siguiente) return 0;
    return Math.round((this.usuario().puntosNivel / siguiente) * 100);
  });
  /** Estadísticas del perfil del usuario. */
  readonly estadisticas = signal<EstadisticaUsuario[]>(this.datos.estadisticas);

  /** Asistencias por día de la semana. */
  readonly asistenciasSemana = signal<AsistenciaDia[]>(this.datos.asistenciasSemana);

  /** Objetivo mensual de visitas. */
  readonly objetivo = signal<ObjetivoMensual>(this.datos.objetivoMensual);

  /** Visitas recientes del usuario. */
  readonly visitasRecientes = signal<VisitaReciente[]>(this.datos.visitasRecientes);

  /** Logros obtenidos por el usuario. */
  readonly logros = signal<Logro[]>(this.datos.logros);

  /** Datos personales del usuario. */
  readonly datosPersonales = signal<DatoPersonal[]>(this.datos.datosPersonales);

  /** Información de la membresía del usuario. */
  readonly membresia = signal<Membresia>(this.datos.membresia);

  /** Cambia a la pestaña indicada. */
  setPestana(pestana: Pestana): void {
    this.pestanaActiva.set(pestana);
  }

  /** Alterna el modo claro/oscuro de la aplicación. */
  toggleTheme(): void {
    this.themeService.toggle();
  }
}
