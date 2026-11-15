import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { AsistenciaDia } from '../../models/usuario.models';

/**
 * Gráfico de barras con la asistencia diaria al gimnasio.
 *
 * Calcula el máximo de visitas para escalar las barras y el total de visitas
 * del periodo mostrado.
 *
 * @author Carlos Valentin Santamaria
 * @version 1.0
 */
@Component({
  // Selector usado en la plantilla del perfil.
  selector: 'app-grafico-asistencia',
  // Componente independiente, sin necesidad de declararlo en un módulo.
  standalone: true,
  // Optimiza el renderizado comprobando cambios solo cuando se notifican.
  changeDetection: ChangeDetectionStrategy.OnPush,
  // Plantilla HTML del gráfico.
  templateUrl: './grafico-asistencia.html',
  // Hoja de estilos del gráfico.
  styleUrl: './grafico-asistencia.css',
})
export class GraficoAsistencia {
  /** Datos diarios de asistencia que se representan en el gráfico. */
  readonly asistencias = input.required<AsistenciaDia[]>();

  /** Mayor número de visitas en un día, con un mínimo de 1 para evitar divisiones por cero. */
  readonly maxVisitas = computed(() =>
    // Calcula el máximo de visitas del periodo, usando 1 como suelo.
    Math.max(...this.asistencias().map((dia) => dia.visitas), 1),
  );

  /** Total de visitas sumando todos los días del periodo. */
  readonly total = computed(() =>
    // Acumula las visitas de todos los días.
    this.asistencias().reduce((total, dia) => total + dia.visitas, 0),
  );
}
