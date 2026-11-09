import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { DatoPersonal } from '../../models/usuario.models';

@Component({
  selector: 'app-lista-datos',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './lista-datos.html',
  styleUrl: './lista-datos.css',
})
export class ListaDatos {
  readonly datos = input.required<DatoPersonal[]>();
}
