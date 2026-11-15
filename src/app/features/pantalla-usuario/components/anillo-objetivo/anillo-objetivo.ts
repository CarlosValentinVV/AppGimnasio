import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/**
 * Anillo de progreso del objetivo mensual.
 *
 * Dibuja un círculo SVG cuyo arco relleno representa el porcentaje de días
 * asistidos respecto a la meta del mes.
 *
 * @author Carlos Valentin Santamaria
 * @version 1.0
 */
@Component({
  // Selector usado en la plantilla del perfil.
  selector: 'app-anillo-objetivo',
  // Componente independiente, sin necesidad de declararlo en un módulo.
  standalone: true,
  // Optimiza el renderizado comprobando cambios solo cuando se notifican.
  changeDetection: ChangeDetectionStrategy.OnPush,
  // Plantilla HTML del anillo.
  templateUrl: './anillo-objetivo.html',
  // Hoja de estilos del anillo.
  styleUrl: './anillo-objetivo.css',
})
export class AnilloObjetivo {
  /** Número de días asistidos en el mes actual. */
  readonly diasMes = input.required<number>();
  /** Meta de días de asistencia para el mes actual. */
  readonly meta = input.required<number>();

  /** Porcentaje de la meta completado (0 si la meta es 0). */
  readonly porcentaje = computed(() => {
    // Recupera la meta actual.
    const meta = this.meta();
    // Evita la división por cero cuando no hay meta.
    if (!meta) return 0;
    // Calcula y redondea el porcentaje de días completados.
    return Math.round((this.diasMes() / meta) * 100);
  });

  /** Días que faltan para alcanzar la meta, sin bajar de 0. */
  readonly restantes = computed(() => Math.max(this.meta() - this.diasMes(), 0));

  /** Longitud de la circunferencia del círculo SVG (radio 52). */
  readonly circunferencia = 2 * Math.PI * 52;
}
