import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { Membresia } from '../../models/usuario.models';

@Component({
  selector: 'app-tarjeta-membresia',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tarjeta-membresia.html',
  styleUrl: './tarjeta-membresia.css',
})
export class TarjetaMembresia {
  readonly plan = input.required<string>();
  readonly miembroDesde = input.required<string>();
  readonly membresia = input.required<Membresia>();

  readonly gestionar = output<void>();
}
