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
import { DATOS_PANTALLA_USUARIO } from '../data/usuario.data';
import type {
  AsistenciaDia,
  DatoPersonal,
  EstadisticaUsuario,
  Logro,
  Membresia,
  ObjetivoMensual,
  PantallaUsuarioData,
  Pestana,
  Usuario,
  VisitaReciente
} from '../models/usuario.models';

/**
 * Pantalla de perfil del cliente (usuario).
 *
 * Muestra las estadísticas, el gráfico de asistencia, el objetivo mensual, los
 * logros, las visitas recientes, los datos personales y la membresía,
 * organizados en tres pestañas: Resumen, Asistencia y Datos.
 *
 * @author raulmoron
 * @version 1.0
 */
@Component({
  // Selector usado en las plantillas para insertar la pantalla de perfil.
  selector: 'app-pantalla-usuario',
  // Componente independiente, sin necesidad de declararlo en un módulo.
  standalone: true,
  // Optimiza el renderizado comprobando cambios solo cuando se notifican.
  changeDetection: ChangeDetectionStrategy.OnPush,
  // Componentes hijos que usa la plantilla del perfil.
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
  // Plantilla HTML de la pantalla de perfil.
  templateUrl: './pantalla-usuario.html',
  // Hoja de estilos de la pantalla de perfil.
  styleUrl: './pantalla-usuario.css',
  // Clases que se aplican dinámicamente al elemento anfitrión.
  host: {
    // Activa los estilos oscuros cuando el tema lo indica.
    '[class.modo-oscuro]': 'isDarkMode()',
    // Activa los estilos claros en caso contrario.
    '[class.modo-claro]': '!isDarkMode()',
  },
})
export class PantallaUsuario {
  /** Pestaña actualmente activa: `resumen`, `asistencia` o `datos`. */
  readonly pestanaActiva = signal<Pestana>('resumen');
  /** Porcentaje de progreso hacia el siguiente nivel de atleta. */
  readonly porcentajeNivel = computed(() => {
    // Puntos necesarios para alcanzar el siguiente nivel.
    const siguiente = this.usuario().puntosSiguienteNivel;
    // Evita la división por cero si no hay un siguiente nivel definido.
    if (!siguiente) return 0;
    // Calcula y redondea el porcentaje completado.
    return Math.round((this.usuario().puntosNivel / siguiente) * 100);
  });

  /** Servicio compartido que controla el tema claro/oscuro. */
  private readonly themeService = inject(ThemeService);
  /** Indica si el modo oscuro está activo. */
  readonly isDarkMode = this.themeService.isDarkMode;
  /** Datos estáticos de la pantalla de perfil. */
  private readonly datos: PantallaUsuarioData = DATOS_PANTALLA_USUARIO;
  /** Datos del usuario que ha iniciado sesión. */
  readonly usuario = signal<Usuario>(this.datos.usuario);
  /** Estadísticas principales del perfil. */
  readonly estadisticas = signal<EstadisticaUsuario[]>(this.datos.estadisticas);
  /** Número de asistencias por cada día de la semana. */
  readonly asistenciasSemana = signal<AsistenciaDia[]>(this.datos.asistenciasSemana);
  /** Progreso del objetivo mensual de visitas. */
  readonly objetivo = signal<ObjetivoMensual>(this.datos.objetivoMensual);
  /** Últimas visitas registradas en el gimnasio. */
  readonly visitasRecientes = signal<VisitaReciente[]>(this.datos.visitasRecientes);
  /** Logros conseguidos y pendientes del usuario. */
  readonly logros = signal<Logro[]>(this.datos.logros);
  /** Datos personales y de contacto del usuario. */
  readonly datosPersonales = signal<DatoPersonal[]>(this.datos.datosPersonales);
  /** Información de la membresía y del estado de la cuota. */
  readonly membresia = signal<Membresia>(this.datos.membresia);

  /**
   * Cambia la pestaña visible del perfil.
   *
   * @param pestana Pestaña que debe mostrarse.
   */
  setPestana(pestana: Pestana): void {
    // Actualiza la pestaña activa.
    this.pestanaActiva.set(pestana);
  }

  /**
   * Alterna el modo claro/oscuro de la aplicación.
   */
  toggleTheme(): void {
    // Delega el cambio en el servicio compartido.
    this.themeService.toggle();
  }
}
