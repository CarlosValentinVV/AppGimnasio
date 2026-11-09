import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { AsistenciaDia } from '../../models/usuario.models';

@Component({
  selector: 'app-grafico-asistencia',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './grafico-asistencia.html',
  styleUrl: './grafico-asistencia.css',
})
export class GraficoAsistencia {
  readonly asistencias = input.required<AsistenciaDia[]>();

  readonly maxVisitas = computed(() =>
    Math.max(...this.asistencias().map((dia) => dia.visitas), 1),
  );

  readonly total = computed(() =>
    this.asistencias().reduce((total, dia) => total + dia.visitas, 0),
  );
}
