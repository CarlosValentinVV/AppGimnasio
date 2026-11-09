import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-anillo-objetivo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './anillo-objetivo.html',
  styleUrl: './anillo-objetivo.css',
})
export class AnilloObjetivo {
  readonly diasMes = input.required<number>();
  readonly meta = input.required<number>();

  readonly porcentaje = computed(() => {
    const meta = this.meta();
    if (!meta) return 0;
    return Math.round((this.diasMes() / meta) * 100);
  });

  readonly restantes = computed(() => Math.max(this.meta() - this.diasMes(), 0));

  // Circunferencia del círculo SVG (r = 52)
  readonly circunferencia = 2 * Math.PI * 52;
}
