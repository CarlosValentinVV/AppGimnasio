import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { Logro } from '../../models/usuario.models';

@Component({
  selector: 'app-lista-logros',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './lista-logros.html',
  styleUrl: './lista-logros.css',
})
export class ListaLogros {
  readonly logros = input.required<Logro[]>();

  readonly logrosConseguidos = computed(
    () => this.logros().filter((logro) => logro.conseguido).length,
  );
}
